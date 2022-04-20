import prisma from "lib/prismaClient";

const handle = (req, res) => {
  const id = req.query.id;

  switch (req.method) {
    case ("DELETE"): {
      return handleDelete(id, res);
    }
    default: {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  }
}

const handleDelete = async (id, res) => {
  const ingredientOnRecipe = await prisma.ingredientsOnRecipes.delete({
    where: {
      id,
    }
  });

  res.status(200).json(ingredientOnRecipe);
}

export default handle;
