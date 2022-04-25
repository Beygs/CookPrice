import Settings from "components/Forms/Settings";
import { useSession } from "components/hooks/useSession";
import styles from "styles/Main.module.scss";

const MyAccount: React.FC = () => {
  const [session, loading] = useSession({ required: true });

  if (typeof session === "boolean") throw new Error("There's a session problem...");

  if (loading) return (
    <div>
      Loading...
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mon Compte</h2>
      </div>
      <Settings />
    </div>
  );
};

export default MyAccount;
