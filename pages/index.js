import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "../components/hooks/useSession";
import Image from "next/image";
import { useState } from "react";
import { fetchSession } from "../components/hooks/useSession";

export default function Component() {
  const [session, loading] = useSession();

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientPrice, setIngredientPrice] = useState("");

  const handleNewIngredient = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/ingredient", {
        name: ingredientName,
        price: parseFloat(ingredientPrice),
        userId: session.user.email,
      });
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
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
