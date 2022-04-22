import { GetStaticProps } from "next";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
import Modal from "components/Modal";
import prisma from "lib/prismaClient";
import styles from "styles/Main.module.scss";
import ingredientsStyles from "./MyIngredients.module.scss";
import NewIngredientForm from "components/Forms/Ingredient";
import { useSession } from "components/hooks/useSession";
import { Allergen, Ingredient } from "@prisma/client";

interface Props {
  allergens: Allergen[];
}

const MyIngredients: React.FC<Props> = ({ allergens }) => {
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);

  const [_, loading] = useSession({ required: true });

  const { data: ingredients, isLoading } = useQuery(
    "ingredients",
    async () => await axios.get<Ingredient[]>("/api/ingredients")
  );

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {showNewIngredientModal && (
        <Modal name="Ajouter un ingrédient" setShow={setShowNewIngredientModal}>
          <NewIngredientForm
            allergens={allergens}
            ingredients={ingredients?.data ?? []}
          />
        </Modal>
      )}
      <div className={styles.header}>
        <h2>Mes Ingrédients</h2>
        <button
          className={styles.btn}
          onClick={() => setShowNewIngredientModal(true)}
        >
          Ajouter un ingrédient
        </button>
      </div>
      {ingredients?.data.map((ingredient) => (
        <div key={ingredient.id} className={ingredientsStyles.ingredient}>
          {ingredient.name} =&gt; {ingredient.price}€ / {ingredient.unit}
        </div>
      ))}
    </div>
  );

  // return signIn();
};

export default MyIngredients;

export const getStaticProps: GetStaticProps = async () => {
  const allergens = await prisma.allergen.findMany();

  return {
    props: { allergens },
  };
};
