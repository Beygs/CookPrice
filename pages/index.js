import { PrismaClient } from "@prisma/client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Component({ allergens }) {
  const { data: session } = useSession();

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
        {allergens.map((allergen) => (
          <p key={allergen.id}>{allergen.name}</p>
        ))}
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

export const getStaticProps = async () => {
  const prisma = new PrismaClient();
  const allergens = await prisma.allergen.findMany();

  return {
    props: { allergens }
  }
}
