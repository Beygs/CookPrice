import { signIn, signOut } from "next-auth/react";
import { useSession } from "components/hooks/useSession";
import Image from "next/image";

const Component = () => {
  const [session, loading] = useSession();

  const imgSrc =
    typeof session === "boolean"
      ? undefined
      : `/api/imageproxy?url=${encodeURIComponent(session?.user?.image)}`;

  if (typeof session === "boolean") throw new Error("There's a session problem...");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <>
        <Image
          src={imgSrc}
          width="100px"
          height="100px"
          alt="Profile picture"
        />
        <br />
        Hello {session.user.name}! <br />
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default Component;
