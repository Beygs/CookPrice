import axios from "axios";
import { useSession } from "components/hooks/useSession";
import { useMutation, useQueryClient } from "react-query";

const Allergens = ({ prevStep, nextStep, values, handleAllergenChange }) => {
  const { name, price, unit, allergens } = values;

  const [session] = useSession();
  const queryClient = useQueryClient();

  const newIngredientMutation = useMutation(
    () => {
      return axios.post("/api/ingredient", {
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
      onSuccess: () => {
        queryClient.invalidateQueries("ingredients");
        nextStep();
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
    <form>
      {allergens.map((allergen) => (
        <div style={{ display: "flex" }} key={allergen.id}>
          <p>{allergen.name}</p>
          <label htmlFor="traces">Traces</label>
          <input
            id="traces"
            type="checkbox"
            checked={allergen.presence === "traces"}
            onChange={handleAllergenChange(allergen.id, "traces")}
          />
          <label htmlFor="presence">Présence</label>
          <input
            id="presence"
            type="checkbox"
            checked={allergen.presence === "presence"}
            onChange={handleAllergenChange(allergen.id, "presence")}
          />
        </div>
      ))}
      <button onClick={handlePrev}>Précédent</button>
      <button onClick={handleNext}>Suivant</button>
    </form>
  );
};

export default Allergens;
