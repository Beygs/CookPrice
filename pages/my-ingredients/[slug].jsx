import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { container, header } from "styles/Main.module.scss";

const Ingredient = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: ingredient, isLoading } = useQuery(
    ["ingredients", slug],
    async () => await axios.get(`/api/ingredient/${slug}`)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (ingredient) {
    return (
      <div className={container}>
        <div className={header}>
          <h2>{ingredient.data.name}</h2>
        </div>
      </div>
    );
  }

  return <div>Recipe</div>;
}

export default Ingredient