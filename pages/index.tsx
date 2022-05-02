import { signIn } from "next-auth/react";
import { useSession } from "components/hooks/useSession";
import styles from "styles/Main.module.scss";
import homeStyles from "./Home.module.scss";
import Link from "next/link";

const Home = () => {
  const [session, loading] = useSession();

  if (typeof session === "boolean")
    throw new Error("There's a session problem...");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className={styles.container}>
        <h2 className={homeStyles.title}>Bonjour {session.user.name} !</h2>
        <div className={styles.header}>
          <Link href="/my-recipes">
            <a className={styles.btn}>
              Voir mes recettes
            </a>
          </Link>
          <Link href="/my-ingredients">
            <a className={styles.btn}>
              Voir mes ingrédients
            </a>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <h2 className={homeStyles.title}>
        Bienvenue sur Cookprice !
      </h2>
      <button className={styles.btn} onClick={() => signIn()}>
        Me connecter
      </button>
    </div>
  );
};

// Home.getLayout = (page: ReactElement) => (
//   <HomeLayout>
//     {page}
//   </HomeLayout>
// );

export default Home;
