import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { container, header, btn } from "styles/Main.module.scss";
import { unitConverter } from "lib/converters";
import { computeIngredientPrice } from "lib/computePrice";
import IngredientOnRecipe from "components/Forms/IngredientOnRecipe";
import prisma from "lib/prismaClient";

const Recipe = ({ allergens }) => {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState(0);
  const [ingredientUnit, setIngredientUnit] = useState("g");

  const router = useRouter();
  const { slug } = router.query;
  const queryClient = useQueryClient();

  const { data: recipe, isLoading: recipeLoading } = useQuery(
    ["recipes", slug],
    async () => await axios.get(`/api/recipe/${slug}`)
  );

  const { data: ingredients, isLoading: ingredientsLoading } = useQuery(
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

  if (recipeLoading || ingredientsLoading) {
    return <div>Loading...</div>;
  }

  if (recipe && ingredients) {
    return (
      <div className={container}>
        <Link href="/my-recipes">
          <a>&lt; Voir toutes mes recettes</a>
        </Link>
        <div className={header}>
          <h2>{recipe.data.name}</h2>
          <div>
            <p>
              Quantité de référence : {recipe.data.quantity} {recipe.data.unit}
            </p>
            <p>
              Prix :{" "}
              {recipe.data.ingredients
                ?.map((ingredient) =>
                  parseFloat(
                    computeIngredientPrice(
                      unitConverter(ingredient.quantity, ingredient.unit),
                      ingredient.ingredient.price
                    )
                  )
                )
                .reduce((a, b) => a + b, 0)}{" "}
              €
            </p>
          </div>
        </div>
        <ul>
          {recipe.data?.ingredients?.map((ingredient) => (
            <li key={ingredient.id}>
              <Link href={`/my-ingredients/${ingredient.ingredient.slug}`}>
                <a>
                  {ingredient.ingredient.name} =&gt; {ingredient.quantity}{" "}
                  {ingredient.unit} (
                  {computeIngredientPrice(
                    unitConverter(ingredient.quantity, ingredient.unit),
                    ingredient.ingredient.price
                  )}{" "}
                  € )
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <IngredientOnRecipe
          recipe={recipe}
          ingredients={ingredients}
          slug={slug}
          allergens={allergens}
        />
      </div>
    );
  }

  return <div>Recipe</div>;
};

export default Recipe;

export const getStaticProps = async () => {
  const allergens = await prisma.allergen.findMany();

  return {
    props: { allergens },
  };
};

export const getStaticPaths = async () => {
  const recipes = await prisma.recipe.findMany({
    select: {
      slug: true,
    },
  });
  const paths = recipes.map((slug) => ({ params: slug }));

  return {
    paths,
    fallback: true,
  };
};
