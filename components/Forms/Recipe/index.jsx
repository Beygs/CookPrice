import axios from "axios";
import cn from "classnames";
import { useSession } from "components/hooks/useSession";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { btn } from "styles/Main.module.scss";
import {
  form,
  inputWrapper,
  input,
  invalid,
  note,
  active,
} from "../Forms.module.scss";

const Recipe = ({ recipes, setShow }) => {
  const [name, setName] = useState("");
  const [invalidName, setInvalidName] = useState(false);
  const [btnTxt, setBtnTxt] = useState("Ajouter la recette");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [session] = useSession();
  const queryClient = useQueryClient();

  const canSave = [name, !invalidName].every(Boolean);

  const handleChange = (e) => {
    const recipesNames = recipes.map((recipe) => recipe.name);
    const value = e.target.value;

    setName(value);
    recipesNames.includes(value) ? setInvalidName(true) : setInvalidName(false);
  };

  const newRecipeMutation = useMutation(
    async () => {
      setBtnTxt("Ajout en cours...");
      setBtnDisabled(true);

      await axios.post("/api/recipe", {
        name,
        userId: session.user.id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("recipes");
        setShow(false);
      },
      onError: (err) => {
        console.error(err);
        setBtnTxt("Ajouter la recette");
        setBtnDisabled(false);
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    newRecipeMutation.mutate();
  }

  return (
    <form className={form} onSubmit={handleSubmit}>
      <div className={inputWrapper}>
        <input
          className={cn(input, {
            [invalid]: invalidName,
          })}
          type="text"
          placeholder="Nom de la recette"
          value={name}
          onChange={handleChange}
        />
        <p
          className={cn(note, {
            [active]: invalidName,
          })}
        >
          Recette déjà existante
        </p>
      </div>
      <input type="submit" className={btn} value={btnTxt} disabled={!canSave && btnDisabled} />
    </form>
  );
};

export default Recipe;
