import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/ingredient
// Required fields in body: name, price, userId
// Optional fields in body: allergenIds
const newIngredient = async (req, res) => {
  const { name, price, userId, allergenIds } = req.body;

  console.log(allergenIds);

  try {
    const result = await prisma.ingredient.create({
      data: {
        name,
        price,
        user: { connect: { email: userId } },
        allergens: {
          connect: allergenIds?.map((allergen) => ({
            name: allergen,
          })),
        },
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(403).json({ Error: err });
  }
};

export default newIngredient;
