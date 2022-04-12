import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "../components/hooks/useSession";
import Image from "next/image";
import { useState } from "react";
import { fetchSession } from "../components/hooks/useSession";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function Component() {
  const [session, loading] = useSession();
  const queryClient = useQueryClient();

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientPrice, setIngredientPrice] = useState("");

  const { data: ingredients } = useQuery(
    "ingredients",
    async () => await axios.get("/api/ingredients")
  );

  const newIngredientMutation = useMutation(
    () => {
      return axios.post("/api/ingredient", {
        name: ingredientName,
        price: parseFloat(ingredientPrice),
        userId: session.user.id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("ingredients");
        setIngredientName("");
        setIngredientPrice("");
      },
    }
  );

  const handleNewIngredient = (e) => {
    e.preventDefault();
    newIngredientMutation.mutate();
  };

  if (session) {
    return (
      <>
        <Image
          src={`/api/imageproxy?url=${encodeURIComponent(session.user.image)}`}
          width="100px"
          height="100px"
          alt="Profile picture"
        />
        <br />
        Hello {session.user.name}! <br />
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        {ingredients?.data.map((ingredient) => (
          <div key={ingredient.id}>
            {ingredient.name}
          </div>
        ))}
        <form onSubmit={handleNewIngredient}>
          <input
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
          />
          <input
            type="text"
            value={ingredientPrice}
            onChange={(e) => setIngredientPrice(e.target.value)}
          />
          <input type="submit" value="Envoyer" />
        </form>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
