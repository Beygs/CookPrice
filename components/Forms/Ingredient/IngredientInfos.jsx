import {
  form,
  input,
  invalid,
  inputWrapper,
  note,
  active,
  priceWrapper,
  select,
} from "./Ingredient.module.scss";
import { btn } from "styles/Main.module.scss";
import cn from "classnames";
import { useState } from "react";

const IngredientInfos = ({ nextStep, handleChange, values }) => {
  const { name, price, unit, ingredients } = values;

  const [validName, setValidName] = useState(true);

  const isValid = [name, validName, price].every(Boolean);

  const handleNameChange = (e) => {
    const ingredientNames = ingredients.map((ingredient) => ingredient.name);
    const value = e.target.value;

    handleChange("name")(e);

    ingredientNames.includes(value) ? setValidName(false) : setValidName(true);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;

    if (/^\d*\.?\d{0,2}$/.test(value)) handleChange("price")(e);
  };

  const handleNext = (e) => {
    e.preventDefault();

    nextStep();
  };

  return (
    <form className={form}>
      <div>
        <div className={inputWrapper}>
          <input
            type="text"
            className={cn(input, {
              [invalid]: !validName,
            })}
            value={name}
            placeholder="Nom de l'ingrédient"
            onChange={handleNameChange}
          />
          <p
            className={cn(note, {
              [active]: !validName,
            })}
          >
            Cet ingrédient existe déjà
          </p>
        </div>
        <div className={priceWrapper}>
          <div className={inputWrapper}>
            <input
              type="text"
              className={input}
              value={price}
              placeholder="Prix"
              onChange={handlePriceChange}
            />
          </div>
          <div>€&nbsp;/&nbsp;</div>
          <select
            value={unit}
            className={`${input} ${select}`}
            onChange={handleChange("unit")}
          >
            <option value="kg">kg</option>
            <option value="L">L</option>
            <option value="unité">unité</option>
          </select>
        </div>
      </div>

      <button className={btn} onClick={handleNext} disabled={!isValid}>
        Suivant
      </button>
    </form>
  );
};

export default IngredientInfos;
