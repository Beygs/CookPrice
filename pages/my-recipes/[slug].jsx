import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { container, header, btn } from "styles/Main.module.scss";
import {
  input,
  inputWrapper,
  multiInputWrapper,
  select,
} from "components/Forms/Forms.module.scss";
import { unitConverter } from "lib/converters";
import { computePrice } from "lib/computePrice";

const Recipe = () => {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState(0);
  const [ingredientUnit, setIngredientUnit] = useState("g");

  const router = useRouter();
  const { slug } = router.query;
  const queryClient = useQueryClient();

  const { data: recipe, isLoading } = useQuery(
    ["recipes", slug],
    async () => await axios.get(`/api/recipe/${slug}`)
  );

  const { data: ingredients } = useQuery(
    ["ingredients"],
    async () => await axios.get("/api/ingredients")
  );

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (recipe) {
    return (
      <div className={container}>
        <Link href="/my-recipes">
          <a>&lt; Voir toutes mes recettes</a>
        </Link>
        <div className={header}>
          <h2>{recipe.data.name}</h2>
          <div>
            Quantité de référence : {recipe.data.quantity} {recipe.data.unit}
          </div>
        </div>
        <ul>
          {recipe.data?.ingredients?.map((ingredient) => (
            <li key={ingredient.id}>
              <Link href={`/my-ingredients/${ingredient.ingredient.slug}`}>
                <a>
                  {ingredient.ingredient.name} =&gt; {ingredient.quantity}{" "}
                  {ingredient.unit} ({computePrice(unitConverter(ingredient.quantity, ingredient.unit), ingredient.ingredient.price)})
                </a>
              </Link>
            </li>
          ))}
        </ul>
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
      </div>
    );
  }

  return <div>Recipe</div>;
};

export default Recipe;
