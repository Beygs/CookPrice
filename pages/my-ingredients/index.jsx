import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
import Modal from "components/Modal";
import prisma from "lib/prismaClient";
import { container, header, btn } from "styles/Main.module.scss";
import { ingredient as ingredientStyle } from "./MyIngredients.module.scss";
import Ingredient from "components/Forms/Ingredient";
import { useSession } from "components/hooks/useSession";
import { signIn } from "next-auth/react";

const MyIngredients = ({ allergens }) => {
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);

  const [session, loading] = useSession();

  const { data: ingredients, isLoading } = useQuery(
    "ingredients",
    async () => await axios.get("/api/ingredients")
  );

  if (loading || isLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  if (session) {
    return (
      <div className={container}>
        {showNewIngredientModal && (
          <Modal
            name="Ajouter un ingrédient"
            setShow={setShowNewIngredientModal}
          >
            <Ingredient allergens={allergens} ingredients={ingredients?.data ?? []} />
          </Modal>
        )}
        <div className={header}>
          <h2>Mes Ingrédients</h2>
          <button className={btn} onClick={() => setShowNewIngredientModal(true)}>
            Ajouter un ingrédient
          </button>
        </div>
        {ingredients?.data.map((ingredient) => (
          <div key={ingredient.id} className={ingredientStyle}>
            {ingredient.name} =&gt; {ingredient.price}€ / {ingredient.unit}
          </div>
        ))}
      </div>
    );
  }

  return signIn();
};

export default MyIngredients;

export const getStaticProps = async () => {
  const allergens = await prisma.allergen.findMany();

  return {
    props: { allergens },
  };
};
