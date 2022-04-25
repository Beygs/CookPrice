import { Allergen, Ingredient, IngredientsOnRecipes, Recipe } from "@prisma/client";
import axios from "axios";
import Modal from "components/Modal";
import { unitsHash } from "lib/constants/units";
import { capitalize } from "lib/utils";
import React, { useState, useEffect, useCallback } from "react";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import { useMutation, useQueryClient } from "react-query";
import styles from "styles/Main.module.scss";
import formsStyles from "../Forms.module.scss";
import IngredientForm from "../Ingredient";

interface Props {
  recipe: RecipeWithIngredients;
  ingredients: Ingredient[];
  allergens: Allergen[];
}

interface IngredientsOnRecipesExtended extends IngredientsOnRecipes {
  ingredient: Ingredient;
  recipe: Recipe;
}

interface RecipeWithIngredients extends Recipe {
  ingredients: IngredientsOnRecipesExtended[];
}

const IngredientOnRecipe: React.FC<Props> = ({ recipe, ingredients, allergens }) => {
  const { input, multiInputWrapper, select } = formsStyles;

  const { value: name, setValue: setName } = useComboboxControls({
    initialValue: "",
    isExpanded: false,
  });
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState<string>(null);
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  const canSave = [
    name,
    ingredients.find((ingredient) => ingredient.name === name),
    quantity > 0,
  ].every(Boolean);

  const recipeIngredients = recipe.ingredients?.map(
    (ingredient) => ingredient.ingredient
  );

  const ingredientsList = ingredients.filter(
    (ingredient) => !recipeIngredients?.find((i) => i.id === ingredient.id)
  );

  const options = ingredientsList?.map((ingredient) => ({
    id: ingredient.name,
    value: ingredient.name,
  }));

  useEffect(() => {
    const ingredient = ingredients.find(
      (ingredient) => ingredient.name === name
    );
    const units = unitsHash[ingredient?.unit];

    if (units) setUnit(units[0]);
    if (!ingredient) {
      setQuantity(0);
      setUnit(undefined);
    }
  }, [ingredients, name]);

  const addIngredient = useMutation(
    async () => {
      const ingredient = await axios.post("/api/ingredients-on-recipe", {
        recipeId: recipe.id,
        ingredientId: ingredients.find(
          (ingredient) => ingredient.name === name
        ).id,
        quantity: quantity,
        unit: unit,
      });

      return ingredient.data;
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(["recipes", recipe.slug]);
        setName("");
        setQuantity(0);
        setUnit("g");
      },
      onError: async (err) => {
        console.error(err);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    addIngredient.mutate();
  };

  const containsValueFilter = useCallback(
    (options, value) =>
      options.filter((option) => {
        const regex = new RegExp(value, "gi");
        return regex.test(option.value);
      }),
    []
  );

  const isNotCreatedFilter = useCallback(
    (options, value) =>
      !ingredientsList.find((ingredient) => ingredient.name === value) && value
        ? [...options, { id: "Add", value: "Ajouter un ingrédient" }]
        : options,
    [ingredientsList]
  );

  return (
    <>
      {showModal && (
        <Modal name="Ajouter un ingrédient" setShow={setShowModal}>
          <IngredientForm
            ingredients={ingredients}
            allergens={allergens}
            name={name}
            setName={setName}
          />
        </Modal>
      )}
      <form onSubmit={handleSubmit}>
        <div className={multiInputWrapper}>
          <DatalistInput
            value={name}
            label="Ajouter un ingrédient"
            showLabel={false}
            placeholder="Ajouter un ingrédient"
            items={options}
            onSelect={(selected) => {
              if (selected.id === "Add") return setShowModal(true);

              setName(selected.value);
            }}
            setValue={(value) => {
              if (value !== "Ajouter un ingrédient") setName(capitalize(value));
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(capitalize(e.target.value))}
            filters={[containsValueFilter, isNotCreatedFilter]}
          />
          {ingredients.find((ingredient) => ingredient.name === name) && (
            <>
              <input
                type="number"
                className={input}
                style={{
                  width: "20%",
                  minWidth: "85px",
                }}
                min="0"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value))}
              />
              <select
                value={unit}
                className={`${input} ${select}`}
                style={{
                  width: "20%",
                  minWidth: "100px",
                }}
                onChange={(e) => setUnit(e.target.value)}
              >
                {unitsHash[
                  ingredients.find(
                    (ingredient) => ingredient.name === name
                  ).unit
                ].map((unit) => (
                  <option value={unit} key={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
        <input
          type="submit"
          value="Ajouter l'ingrédient"
          className={styles.btn}
          disabled={!canSave}
        />
      </form>
    </>
  );
};

export default IngredientOnRecipe;
