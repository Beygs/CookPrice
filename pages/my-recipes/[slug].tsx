import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import styles from "styles/Main.module.scss";
import { unitConverter } from "lib/converters";
import { computeIngredientPrice } from "lib/computePrice";
import IngredientOnRecipe from "components/Forms/IngredientOnRecipe";
import prisma from "lib/prismaClient";
import { PencilIcon, TrashIcon } from "components/Icons";
import recipesStyles from "./MyRecipes.module.scss";
import Modal from "components/Modal";
import EditIngredientQuantity from "components/Forms/IngredientOnRecipe/EditQuantity";
import {
  Allergen,
  Ingredient,
  IngredientsOnRecipes,
  Recipe,
} from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "components/hooks/useSession";

interface Props {
  allergens: Allergen[];
}

interface IngredientsOnRecipesExtended extends IngredientsOnRecipes {
  ingredient: Ingredient;
  recipe: Recipe;
}

interface RecipeWithIngredients extends Recipe {
  ingredients: IngredientsOnRecipesExtended[];
}

const Recipe: React.FC<Props> = ({ allergens }) => {
  const [modal, setModal] = useState<ReactElement | false>(false);

  const [_, loading] = useSession({ required: true });

  const router = useRouter();
  const { slug } = router.query;

  const queryClient = useQueryClient();

  const { data: recipe, isLoading: recipeLoading } = useQuery(
    ["recipes", slug],
    async () => await axios.get<RecipeWithIngredients>(`/api/recipe/${slug}`)
  );

  const { data: ingredients, isLoading: ingredientsLoading } = useQuery(
    ["ingredients"],
    async () => await axios.get<Ingredient[]>("/api/ingredients")
  );

  const editIngredient = (ingredient: IngredientsOnRecipesExtended) => {
    setModal(
      <Modal
        name={`Editer la quantité de ${ingredient.ingredient.name}`}
        setShow={() => setModal(false)}
      >
        <EditIngredientQuantity ingredient={ingredient} setShow={setModal} />
      </Modal>
    );
  };

  const deleteIngredient = useMutation(
    async (id: string) => {
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

  if (recipeLoading || ingredientsLoading || loading) {
    return <div>Loading...</div>;
  }

  if (recipe && ingredients) {
    return (
      <div className={styles.container}>
        {modal}
        <Link href="/my-recipes">
          <a>&lt; Voir toutes mes recettes</a>
        </Link>
        <div className={styles.header}>
          <h2>{recipe.data.name}</h2>
          <div>
            <p>
              Quantité de référence : {recipe.data.quantity} {recipe.data.unit}
            </p>
            <p>
              Prix :{" "}
              {recipe.data.ingredients
                ?.map((ingredient) =>
                  computeIngredientPrice(
                    unitConverter(ingredient.quantity, ingredient.unit),
                    ingredient.ingredient.price
                  )
                )
                .reduce((a, b) => a + b, 0)
                .toFixed(2)}{" "}
              €
            </p>
          </div>
        </div>
        <ul>
          {recipe.data?.ingredients?.map((ingredient) => (
            <li className={recipesStyles.ingredient} key={ingredient.id}>
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
              <div className={recipesStyles.actions}>
                <button onClick={() => editIngredient(ingredient)}>
                  <PencilIcon className={styles.pencilIcon} />
                </button>
                <button onClick={() => deleteIngredient.mutate(ingredient.id)}>
                  <TrashIcon className={styles.trashIcon} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <IngredientOnRecipe
          recipe={recipe.data}
          ingredients={ingredients.data}
          allergens={allergens}
        />
      </div>
    );
  }

  return <div>Recipe</div>;
};

export default Recipe;

export const getStaticProps: GetStaticProps = async () => {
  const allergens = await prisma.allergen.findMany();

  return {
    props: { allergens },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
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