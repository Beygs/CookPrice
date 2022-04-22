import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismaClient";
import { getSession } from "next-auth/react";

const getRecipes = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    const recipes = await prisma.recipe.findMany({
      where: {
        userId: session.user.id,
      },
    });

    res.status(200).json(recipes);
  } else {
    res.status(401);
  }
};

export default getRecipes;
