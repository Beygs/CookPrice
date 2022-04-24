import axios from "axios";
import { useSession } from "components/hooks/useSession";
import { useMutation, useQueryClient } from "react-query";
import {
  form,
  checkboxWrapper,
  allergen as allergenStyle,
  actions,
} from "../Forms.module.scss";
import styles from "styles/Main.module.scss";
import React, { useState } from "react";

interface Props {
  prevStep: () => void;
  nextStep: () => void;
  values: {
    name: any;
    price: string;
    unit: string;
    allergens: any;
    ingredients: any;
    setName: any;
  };
  handleAllergenChange: (id: any, type: any) => (e: any) => void;
}

const Allergens: React.FC<Props> = ({
  prevStep,
  nextStep,
  values,
  handleAllergenChange,
}) => {
  const { name, price, unit, allergens, setName } = values;

  const [btnTxt, setBtnTxt] = useState("Ajouter l'ingrédient");
  const [btnsDisabled, setBtnsDisabled] = useState(false);

  const queryClient = useQueryClient();
  const [session] = useSession();

  if (typeof session === "boolean")
    throw new Error("There's a session problem...");

  const newIngredientMutation = useMutation(
    async () => {
      setBtnTxt("Ajout en cours...");
      setBtnsDisabled(true);

      const ingredient = await axios.post("/api/ingredient", {
        name,
        price: parseFloat(price),
        unit,
        userId: session.user.id,
        allergens: {
          create: allergens
            .filter((allergen) => allergen.presence !== "none")
            .map((allergen) => ({
              presence: allergen.presence,
              allergen: {
                connect: {
                  id: allergen.id,
                },
              },
            })),
        },
      });

      return ingredient;
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("ingredients");
        nextStep();
        if (setName) setName(name);
      },
      onError: async (err) => {
        console.error(err);
        setBtnTxt("Ajouter l'ingrédient");
        setBtnsDisabled(false);
      },
    }
  );

  const handlePrev = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    prevStep();
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    newIngredientMutation.mutate();
  };

  return (
    <form className={form}>
      {allergens.map((allergen) => (
        <div className={allergenStyle} key={allergen.id}>
          <p>{allergen.name}</p>
          <div className={checkboxWrapper}>
            <label htmlFor="traces">Traces</label>
            <input
              id="traces"
              type="checkbox"
              checked={allergen.presence === "traces"}
              onChange={handleAllergenChange(allergen.id, "traces")}
            />
          </div>
          <div className={checkboxWrapper}>
            <label htmlFor="presence">Présence</label>
            <input
              id="presence"
              type="checkbox"
              checked={allergen.presence === "presence"}
              onChange={handleAllergenChange(allergen.id, "presence")}
            />
          </div>
        </div>
      ))}
      <div className={actions}>
        <button
          className={styles.btn}
          disabled={btnsDisabled}
          onClick={handlePrev}
        >
          Précédent
        </button>
        <button
          className={styles.btn}
          disabled={btnsDisabled}
          onClick={handleNext}
        >
          {btnTxt}
        </button>
      </div>
    </form>
  );
};

export default Allergens;
