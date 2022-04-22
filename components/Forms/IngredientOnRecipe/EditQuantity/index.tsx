import React, { useState } from "react";
import formsStyles from "components/Forms/Forms.module.scss";
import styles from "styles/Main.module.scss";
import { unitsHash } from "lib/constants/units";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const EditIngredientQuantity = ({ ingredient, setShow }) => {
  const { form, multiInputWrapper, input, select } = formsStyles;

  const [quantity, setQuantity] = useState(parseInt(ingredient.quantity));
  const [unit, setUnit] = useState(ingredient.unit);

  const queryClient = useQueryClient();

  const handleEdit = useMutation(
    async () => {
      const response = await axios.patch(
        `/api/ingredients-on-recipe/${ingredient.id}`,
        {
          quantity,
          unit,
        }
      );

      return response.data;
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["recipes", ingredient.recipe.slug]);
        setShow(false);
      },
      onError: async (err) => {
        console.error(err);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleEdit.mutate();
  };

  return (
    <form className={form} onSubmit={handleSubmit}>
      <div className={multiInputWrapper}>
        <input
          type="number"
          className={input}
          min="0"
          value={quantity}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value))}
        />
        <select
          value={unit}
          className={`${input} ${select}`}
          onChange={(e) => setUnit(e.target.value)}
        >
          {unitsHash[ingredient.unit].map((unit) => (
            <option value={unit} key={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
      <input type="submit" value="Editer" className={styles.btn} />
    </form>
  );
};

export default EditIngredientQuantity;
