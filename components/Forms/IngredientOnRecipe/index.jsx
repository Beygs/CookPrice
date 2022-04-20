import axios from "axios";
import { unitsHash } from "lib/constants/units";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { btn } from "styles/Main.module.scss";
import {
  input,
  inputWrapper,
  multiInputWrapper,
  select,
} from "../Forms.module.scss";

const IngredientOnRecipe = ({ recipe, ingredients, slug }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState();

  const queryClient = useQueryClient();

  const canSave = [
    name,
    ingredients.data.find((ingredient) => ingredient.name === name),
    quantity > 0,
  ].every(Boolean);

  const recipeIngredients = recipe.data.ingredients?.map(
    (ingredient) => ingredient.ingredient
  );

  const ingredientsList = ingredients.data.filter((ingredient) =>
    !recipeIngredients.find((i) => i.id === ingredient.id)
  );

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

  return (
    <form onSubmit={handleSubmit}>
      <div className={multiInputWrapper}>
        <input
          value={name}
          list="ingredients-list"
          placeholder="Ajouter un ingrédient"
          className={input}
          onChange={(e) => setName(e.target.value)}
        />
        <datalist id="ingredients-list">
          {ingredientsList?.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.name} />
          ))}
        </datalist>
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
                ingredients.data.find((ingredient) => ingredient.name === name)
                  .unit
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
  );
};

export default IngredientOnRecipe;
