import axios from "axios";
import Modal from "components/Modal";
import { unitsHash } from "lib/constants/units";
import { capitalize } from "lib/utils";
import { useState, useEffect, useCallback } from "react";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import { useMutation, useQueryClient } from "react-query";
import { btn } from "styles/Main.module.scss";
import {
  input,
  inputWrapper,
  multiInputWrapper,
  select,
} from "../Forms.module.scss";
import Ingredient from "../Ingredient";

const IngredientOnRecipe = ({ recipe, ingredients, slug, allergens }) => {
  const { value: name, setValue: setName } = useComboboxControls({
    initialValue: "",
  });
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState();
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  const canSave = [
    name,
    ingredients.data.find((ingredient) => ingredient.name === name),
    quantity > 0,
  ].every(Boolean);

  const recipeIngredients = recipe.data.ingredients?.map(
    (ingredient) => ingredient.ingredient
  );

  const ingredientsList = ingredients.data.filter(
    (ingredient) => !recipeIngredients?.find((i) => i.id === ingredient.id)
  );

  const options = ingredientsList?.map((ingredient) => ({
    id: ingredient.name,
    value: ingredient.name,
  }));

  useEffect(() => {
    const ingredient = ingredients.data.find(
      (ingredient) => ingredient.name === name
    );
    const units = unitsHash[ingredient?.unit];

    if (units) setUnit(units[0]);
    if (!ingredient) {
      setQuantity(0);
      setUnit(undefined);
    }
  }, [ingredients.data, name]);

  const addIngredient = useMutation(
    async () => {
      const ingredient = await axios.post("/api/ingredients-on-recipe", {
        recipeId: recipe.data.id,
        ingredientId: ingredients.data.find(
          (ingredient) => ingredient.name === name
        ).id,
        quantity: quantity,
        unit: unit,
      });

      return ingredient.data;
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(["recipes", slug]);
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
          <Ingredient
            ingredients={ingredients.data}
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
            placeholder="Ajouter un ingrédient"
            items={options}
            onSelect={(selected) => {
              if (selected.id === "Add") return setShowModal(true);

              setName(selected.value);
            }}
            setValue={(value) => {
              if (value !== "Ajouter un ingrédient") setName(capitalize(value));
            }}
            onChange={(e) => setName(capitalize(e.target.value))}
            filters={[containsValueFilter, isNotCreatedFilter]}
          />
          {ingredients.data.find((ingredient) => ingredient.name === name) && (
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
                onChange={(e) => setQuantity(e.target.value)}
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
                  ingredients.data.find(
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
          className={btn}
          disabled={!canSave}
        />
      </form>
    </>
  );
};

export default IngredientOnRecipe;
