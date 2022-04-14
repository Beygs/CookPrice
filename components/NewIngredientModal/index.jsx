import Ingredient from "components/Forms/Ingredient";
import { CrossIcon } from "components/Icons";
import {
  blocker,
  modal,
  header,
  cross,
} from "./NewIngredientModal.module.scss";

const NewIngredientModal = ({ show, setShow, allergens, ingredients }) => {
  return (
    <>
      <div className={blocker} onClick={() => setShow(false)} />
      <div className={modal}>
        <div className={header}>
          <h2>Ajouter un ingrédient</h2>
          <button className={cross} onClick={() => setShow(false)}>
            <CrossIcon />
          </button>
        </div>
        <Ingredient allergens={allergens} ingredients={ingredients} />
      </div>
    </>
  );
};

export default NewIngredientModal;
