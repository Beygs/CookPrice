import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { container, header, btn } from "styles/Main.module.scss";
import { unitConverter } from "lib/converters";
import { computeIngredientPrice } from "lib/computePrice";
import IngredientOnRecipe from "components/Forms/IngredientOnRecipe";
import prisma from "lib/prismaClient";
import { TrashIcon } from "components/Icons";

const Recipe = ({ allergens }) => {
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

  const deleteIngredient = useMutation(
    async (id) => {
      await axios.delete(`/api/ingredients-on-recipe/${id}`);
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries(["recipes", slug]);
      },
      onError: async (err) => {
        console.error(err);
      },
    }
  );

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
              <button onClick={() => deleteIngredient.mutate(ingredient.id)}>
                <TrashIcon style={{ height: "1rem" }} />
              </button>
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
