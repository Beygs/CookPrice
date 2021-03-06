import prisma from "lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

// POST /api/ingredients-on-recipe
// Required fields: ingredientId, recipeId, quantity, unit
const newIngredientOnRecipe = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ingredientId, recipeId, quantity, unit } = req.body;

  try {
    const result = await prisma.ingredientsOnRecipes.create({
      data: {
        ingredient: {
          connect: {
            id: ingredientId,
          },
        },
        recipe: {
          connect: {
            id: recipeId,
          },
        },
        unit,
        quantity: parseInt(quantity),
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: err });
  }
};

export default newIngredientOnRecipe;
