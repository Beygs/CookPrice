import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
import NewIngredientModal from "components/NewIngredientModal";
import prisma from "lib/prismaClient";

const MyIngredients = ({ allergens }) => {
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);

  const { data: ingredients } = useQuery(
    "ingredients",
    async () => await axios.get("/api/ingredients"),
  );

  return (
    <>
      {showNewIngredientModal && (
        <NewIngredientModal
          show={showNewIngredientModal}
          setShow={setShowNewIngredientModal}
          allergens={allergens}
          ingredients={ingredients.data}
        />
      )}
      <h2>Mes Ingrédients</h2>
      <button onClick={() => setShowNewIngredientModal(true)}>Ajouter un ingrédient</button>
      {ingredients?.data.map((ingredient) => (
        <div key={ingredient.id}>{ingredient.name} =&gt; {ingredient.price}€ / {ingredient.unit}</div>
      ))}
    </>
  );
};

export default MyIngredients;

export const getStaticProps = async () => {
  const allergens = await prisma.allergen.findMany();

  return {
    props: { allergens }
  }
}
