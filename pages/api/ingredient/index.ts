import prisma from "lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

// POST /api/ingredient
// Required fields: name, price, userId
// Optional fields: allergenIds
const newIngredient = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, price, unit, userId, allergens } = req.body;

  try {
    const result = await prisma.ingredient.create({
      data: {
        name,
        price,
        unit,
        user: { connect: { id: userId } },
        allergens,
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

export default newIngredient;
