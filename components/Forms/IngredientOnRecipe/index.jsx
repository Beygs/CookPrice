import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { btn } from "styles/Main.module.scss";
import {
  input,
  inputWrapper,
  multiInputWrapper,
  select,
} from "../Forms.module.scss";

const IngredientOnRecipe = ({ recipe, ingredients, slug }) => {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState(0);
  const [ingredientUnit, setIngredientUnit] = useState("g");

  const queryClient = useQueryClient();

  const addIngredient = useMutation(
    async () => {
      const ingredient = await axios.post("/api/ingredients-on-recipe", {
        recipeId: recipe.data.id,
        ingredientId: ingredients.data.find(
          (ingredient) => ingredient.name === ingredientName
        ).id,
        quantity: ingredientQuantity,
        unit: ingredientUnit,
      });

      return ingredient.data;
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(["recipes", slug]);
        setIngredientName("");
        setIngredientQuantity(0);
        setIngredientUnit("g");
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
              value={ingredientName}
              list="ingredients-list"
              placeholder="Ajouter un ingrédient"
              className={input}
              onChange={(e) => setIngredientName(e.target.value)}
            />
            <datalist id="ingredients-list">
              {ingredients?.data?.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.name} />
              ))}
            </datalist>
            {ingredientName && (
              <>
                <input
                  type="number"
                  className={input}
                  style={{
                    width: "20%",
                    minWidth: "85px",
                  }}
                  min="0"
                  value={ingredientQuantity}
                  onChange={(e) => setIngredientQuantity(e.target.value)}
                />
                <select
                  value={ingredientUnit}
                  className={`${input} ${select}`}
                  style={{
                    width: "20%",
                    minWidth: "100px",
                  }}
                  onChange={(e) => setIngredientUnit(e.target.value)}
                >
                  <option value="g">g</option>
                  <option value="mg">mg</option>
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="cl">cl</option>
                  <option value="dl">dl</option>
                  <option value="unité">unités</option>
                </select>
              </>
            )}
          </div>
          <input type="submit" value="Ajouter l'ingrédient" className={btn} />
        </form>
  )
}

export default IngredientOnRecipe