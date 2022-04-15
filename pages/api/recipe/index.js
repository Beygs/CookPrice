// POST /api/recipe

import prisma from "lib/prismaClient";

// Required fields: name, userId
const newRecipe = async (req, res) => {
  const { name, userId } = req.body;

  try {
    const result = await prisma.recipe.create({
      data: {
        name,
        user: { connect: { id: userId } },
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: err });
  }
};

export default newRecipe;
