import axios from "axios";
import cn from "classnames";
import { useSession } from "components/hooks/useSession";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { btn } from "styles/Main.module.scss";
import {
  form,
  multiInputWrapper,
  inputWrapper,
  input,
  select,
  invalid,
  note,
  active,
} from "../Forms.module.scss";

const Recipe = ({ recipes, setShow }) => {
  const nameRef = useRef();

  const [name, setName] = useState("");
  const [invalidName, setInvalidName] = useState(false);
  const [quantity, setQuantity] = useState();
  const [unit, setUnit] = useState("kg");
  const [btnTxt, setBtnTxt] = useState("Ajouter la recette");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [session] = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const canSave = [name, !invalidName].every(Boolean);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    newRecipeMutation.mutate();
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
          <select className={`${input} ${select}`} value={unit} onChange={(e) => setUnit(e.target.value)}>
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
        className={btn}
        value={btnTxt}
        disabled={!canSave && !btnDisabled}
      />
    </form>
  );
};

export default Recipe;
