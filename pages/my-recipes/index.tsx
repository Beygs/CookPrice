import { Recipe } from "@prisma/client";
import axios from "axios";
import NewRecipeForm from "components/Forms/Recipe";
import { useSession } from "components/hooks/useSession";
import Modal from "components/Modal";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";
import styles from "styles/Main.module.scss";

const MyRecipes: React.FC = () => {
  const [showNewRecipeModal, setShowNewRecipeModal] = useState(false);

  const [_, loading] = useSession({ required: true });

  const { data: recipes, isLoading } = useQuery(
    "recipes",
    async () => await axios.get<Recipe[]>("/api/recipes")
  );

  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {showNewRecipeModal && (
        <Modal name="Ajouter une recette" setShow={setShowNewRecipeModal}>
          <NewRecipeForm
            recipes={recipes?.data ?? []}
            setShow={setShowNewRecipeModal}
          />
        </Modal>
      )}
      <div className={styles.header}>
        <h2>Mes recettes</h2>
        <button className={styles.btn} onClick={() => setShowNewRecipeModal(true)}>
          Ajouter une recette
        </button>
      </div>
      <ul>
        {recipes?.data.map((recipe) => (
          <li key={recipe.id}>
            <Link href={`/my-recipes/${recipe.slug}`}>
              <a>{recipe.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRecipes;
