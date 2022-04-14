import Ingredient from "components/Forms/Ingredient";
import { useState } from "react";
import { useQuery } from "react-query";
import { blocker, modal } from "./NewIngredientModal.module.scss";

const NewIngredientModal = ({ show, setShow, allergens, ingredients }) => {
  return (
    <>
      <div className={blocker} onClick={() => setShow(false)} />
      <div className={modal}>
        <h2>Ajouter un ingrédient</h2>
        <Ingredient allergens={allergens} ingredients={ingredients} />
      </div>
    </>
  )
}

export default NewIngredientModal