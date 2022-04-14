import prisma from "lib/prismaClient";

// POST /api/ingredient
// Required fields in body: name, price, userId
// Optional fields in body: allergenIds
const newIngredient = async (req, res) => {
  const { name, price, unit, userId, allergens } = req.body;

  try {
    const result = await prisma.ingredient.create({
      data: {
        name,
        price,
        unit,
        user: { connect: { id: userId } },
        allergens,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(403).json({ Error: err });
  }
};

export default newIngredient;
