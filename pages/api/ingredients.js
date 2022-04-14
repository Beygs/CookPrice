import prisma from "lib/prismaClient";
import { getSession } from "next-auth/react";

const getIngredients = async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    const ingredients = await prisma.ingredient.findMany({
      where: { userId: session.user.id },
      include: {
        allergens: true,
      },
    });
    res.status(200).json(ingredients);
  }
};

export default getIngredients;
