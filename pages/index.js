import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image";

export default function Component() {
  const { data: session } = useSession()
  const pouet = useSession()

  console.log(pouet);
  if (session) {
    return (
      <>
        <Image
          src={`/api/imageproxy?url=${encodeURIComponent(session.user.image)}`}
          width="100px"
          height="100px"
          alt="Profile picture"
        /><br />
        Hello {session.user.name}! <br />
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}