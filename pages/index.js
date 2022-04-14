import axios from "axios";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "components/hooks/useSession";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function Component() {
  const [session, loading] = useSession();
  
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
