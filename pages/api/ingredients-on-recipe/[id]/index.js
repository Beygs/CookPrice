import prisma from "lib/prismaClient";

const handle = (req, res) => {
  const id = req.query.id;

  switch (req.method) {
    case ("DELETE"): {
      return handleDelete(id, res);
    }
    case("PUT"): {
      return handleEdit(id, req.body, res)
    }
    case("PATCH"): {
      return handleEdit(id, req.body, res)
    }
    default: {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  }
}

const handleEdit = async (id, data, res) => {
  const ingredientOnRecipe = await prisma.ingredientsOnRecipes.update({
    where: {
      id,
    },
    data,
  });

  res.status(200).json(ingredientOnRecipe);
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
