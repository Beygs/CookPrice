import axios from "axios";
import Recipe from "components/Forms/Recipe";
import Modal from "components/Modal";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";
import { container, header, btn } from "styles/Main.module.scss";

const MyRecipes = () => {
  const [showNewRecipeModal, setShowNewRecipeModal] = useState(false);

  const { data: recipes } = useQuery(
    "recipes",
    async () => await axios.get("/api/recipes")
  );

  return (
    <div className={container}>
      {showNewRecipeModal && (
        <Modal name="Ajouter une recette" setShow={setShowNewRecipeModal}>
          <Recipe
            recipes={recipes?.data ?? []}
            setShow={setShowNewRecipeModal}
          />
        </Modal>
      )}
      <div className={header}>
        <h2>Mes recettes</h2>
        <button className={btn} onClick={() => setShowNewRecipeModal(true)}>
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
