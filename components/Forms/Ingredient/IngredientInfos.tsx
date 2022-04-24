import {
  form,
  input,
  invalid,
  inputWrapper,
  note,
  active,
  multiInputWrapper,
  select,
} from "../Forms.module.scss";
import styles from "styles/Main.module.scss";
import cn from "classnames";
import React, { useState, useRef, useEffect } from "react";
import { Values } from ".";

interface Props {
  nextStep: () => void;
  values: Values;
  handleChange: (input: any) => (e: any) => void;
}

const IngredientInfos: React.FC<Props> = ({
  nextStep,
  handleChange,
  values,
}) => {
  const { name, price, unit, ingredients } = values;

  const nameRef = useRef<HTMLInputElement>();

  const [validName, setValidName] = useState(true);

  const isValid = [name, validName, price].every(Boolean);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ingredientNames = ingredients.map((ingredient) => ingredient.name);
    const value = e.target.value;

    handleChange("name")(e);

    ingredientNames.includes(value) ? setValidName(false) : setValidName(true);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*\.?\d{0,2}$/.test(value)) handleChange("price")(e);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
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
            ref={nameRef}
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
        <div className={multiInputWrapper}>
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

      <button className={styles.btn} onClick={handleNext} disabled={!isValid}>
        Suivant
      </button>
    </form>
  );
};

export default IngredientInfos;
