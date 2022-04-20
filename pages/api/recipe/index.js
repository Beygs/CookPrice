// POST /api/recipe

import prisma from "lib/prismaClient";
import slugify from "slugify";

// Required fields: name, userId, quantity, unit
const newRecipe = async (req, res) => {
  const { name, userId, quantity, unit } = req.body;

  try {
    const result = await prisma.recipe.create({
      data: {
        name,
        quantity: parseInt(quantity),
        unit,
        user: { connect: { id: userId } },
        slug: slugify(name, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: err });
  }
};

export default newRecipe;
