import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";

const Recipe = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: recipe, isLoading } = useQuery(
    ["recipes", slug], 
    async () => await axios.get(`/api/recipe/${slug}`)
  );

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if (recipe) {
    return (
      <div>
        {console.log(recipe.data)}
        {recipe.data.name}
      </div>
    );
  }

  return (
    <div>
      Recipe
    </div>
  )
};

export default Recipe;
