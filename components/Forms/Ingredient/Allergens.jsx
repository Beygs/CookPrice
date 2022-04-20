import axios from "axios";
import { useSession } from "components/hooks/useSession";
import { useMutation, useQueryClient } from "react-query";
import {
  form,
  checkboxWrapper,
  allergen as allergenStyle,
  actions,
} from "../Forms.module.scss";
import { btn } from "styles/Main.module.scss";
import { useState } from "react";

const Allergens = ({ prevStep, nextStep, values, handleAllergenChange }) => {
  const { name, price, unit, allergens } = values;

  const [btnTxt, setBtnTxt] = useState("Ajouter l'ingrédient");
  const [btnsDisabled, setBtnsDisabled] = useState(false);

  const [session] = useSession();
  const queryClient = useQueryClient();

  const newIngredientMutation = useMutation(
    () => {
      setBtnTxt("Ajout en cours...");
      setBtnsDisabled(true);

      axios.post("/api/ingredient", {
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
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("ingredients");
        nextStep();
      },
      onError: async (err) => {
        console.error(err);
        setBtnTxt("Ajouter l'ingrédient");
        setBtnDisabled(false);
      },
    }
  );

  const handlePrev = (e) => {
    e.preventDefault();

    prevStep();
  };

  const handleNext = (e) => {
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
        <button className={btn} disabled={btnsDisabled} onClick={handlePrev}>
          Précédent
        </button>
        <button className={btn} disabled={btnsDisabled} onClick={handleNext}>
          {btnTxt}
        </button>
      </div>
    </form>
  );
};

export default Allergens;
