import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
import NewIngredientModal from "components/NewIngredientModal";
import prisma from "lib/prismaClient";
import { container, btn } from "styles/Main.module.scss";
import { header, ingredient as ingredientStyle } from "./MyIngredients.module.scss";

const MyIngredients = ({ allergens }) => {
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);

  const { data: ingredients } = useQuery(
    "ingredients",
    async () => await axios.get("/api/ingredients"),
  );

  return (
    <div className={container}>
      {showNewIngredientModal && (
        <NewIngredientModal
          show={showNewIngredientModal}
          setShow={setShowNewIngredientModal}
          allergens={allergens}
          ingredients={ingredients?.data ?? []}
        />
      )}
      <div className={header}>
        <h2>Mes Ingrédients</h2>
        <button className={btn} onClick={() => setShowNewIngredientModal(true)}>Ajouter un ingrédient</button>
      </div>
      {ingredients?.data.map((ingredient) => (
        <div key={ingredient.id} className={ingredientStyle}>{ingredient.name} =&gt; {ingredient.price}€ / {ingredient.unit}</div>
      ))}
    </div>
  );
};

export default MyIngredients;

export const getStaticProps = async () => {
  const allergens = await prisma.allergen.findMany();

  return {
    props: { allergens }
  }
}
