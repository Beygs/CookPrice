import { Recipe } from "@prisma/client";
import axios from "axios";
import cn from "classnames";
import { useSession } from "components/hooks/useSession";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import styles from "styles/Main.module.scss";
import formsStyles from "../Forms.module.scss";

interface Props {
  recipe?: Recipe;
  recipes: Recipe[];
  setShow: React.Dispatch<React.SetStateAction<React.ReactElement | boolean>>
}

const Recipe: React.FC<Props> = ({ recipe, recipes, setShow }) => {
  const {
    form,
    multiInputWrapper,
    inputWrapper,
    input,
    select,
    invalid,
    note,
    active,
  } = formsStyles;

  const nameRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(recipe?.name ?? "");
  const [invalidName, setInvalidName] = useState(false);
  const [quantity, setQuantity] = useState<string>(String(recipe?.quantity) ?? "0");
  const [unit, setUnit] = useState(recipe?.unit ?? "kg");
  const [btnTxt, setBtnTxt] = useState(recipe ? "Editer la recette" : "Ajouter la recette");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [session] = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const canSave = [name, !invalidName].every(Boolean);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const recipesNames = recipes.map((recipe) => recipe.name);
    const value = e.target.value;

    setName(value);
    recipesNames.includes(value) ? setInvalidName(true) : setInvalidName(false);
  };

  const newRecipeMutation = useMutation(
    async () => {
      setBtnTxt("Ajout en cours...");
      setBtnDisabled(true);

      if (typeof session === "boolean") throw new Error("There's a session problem...");

      const response = await axios.post("/api/recipe", {
        name,
        userId: session.user.id,
        quantity,
        unit,
      });

      return response.data;
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries("recipes");
        setShow(false);
        router.push(`/my-recipes/${data.slug}`);
      },
      onError: async (err) => {
        console.error(err);
        setBtnTxt("Ajouter la recette");
        setBtnDisabled(false);
      },
    }
  );

  const editRecipeMutation = useMutation(
    async () => {
      setBtnTxt("Edition en cours...");
      setBtnDisabled(true);

      if (typeof session === "boolean") throw new Error("There's a session problem...");

      const response = await axios.put(`/api/recipe/${recipe.slug}`, {
        name,
        quantity,
        unit,
      });

      return response;
    },
    {
      onSuccess: async (response) => {
        queryClient.invalidateQueries(["recipes", recipe.slug]);
        setShow(false);
        router.replace(`/my-recipes/${response.data.slug}`);
      },
      onError: async (err) => {
        console.error(err);
        setBtnTxt("Editer la recette");
        setBtnDisabled(false);
      },
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    recipe ? editRecipeMutation.mutate() : newRecipeMutation.mutate();
  };

  return (
    <form className={form} onSubmit={handleSubmit}>
      <div>
        <div className={inputWrapper}>
          <input
            className={cn(input, {
              [invalid]: invalidName,
            })}
            type="text"
            placeholder="Nom de la recette"
            value={name}
            ref={nameRef}
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
        <div className={multiInputWrapper}>
          <input
            type="number"
            className={input}
            placeholder="Quantité de référence"
            value={quantity}
            min="0"
            onChange={(e) => setQuantity(e.target.value)}
          />
          <select
            className={`${input} ${select}`}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="mg">mg</option>
            <option value="L">L</option>
            <option value="dl">dl</option>
            <option value="cl">cl</option>
            <option value="ml">ml</option>
            <option value="personnes">personnes</option>
          </select>
        </div>
      </div>
      <input
        type="submit"
        className={styles.btn}
        value={btnTxt}
        disabled={!canSave && !btnDisabled}
      />
    </form>
  );
};

export default Recipe;
