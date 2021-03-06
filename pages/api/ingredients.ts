import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismaClient";
import { getSession } from "next-auth/react";

const getIngredients = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    const ingredients = await prisma.ingredient.findMany({
      where: { userId: session.user.id },
      include: {
        allergens: true,
      },
    });
    res.status(200).json(ingredients);
  } else {
    res.status(401);
  }
};

export default getIngredients;
