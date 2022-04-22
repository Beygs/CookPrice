import { Ingredient } from "@prisma/client";
import axios from "axios";
import { useSession } from "components/hooks/useSession";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import styles from "styles/Main.module.scss";

const Ingredient: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [_, loading] = useSession({ required: true });

  const { data: ingredient, isLoading } = useQuery(
    ["ingredients", slug],
    async () => await axios.get<Ingredient>(`/api/ingredient/${slug}`)
  );

  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  if (ingredient) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{ingredient.data.name}</h2>
        </div>
      </div>
    );
  }

  return <div>Recipe</div>;
};

export default Ingredient;
