const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  await prisma.allergen.createMany({
    data: [
      "Gluten",
      "Crustacés",
      "Oeufs",
      "Arachides",
      "Poissons",
      "Soja",
      "Lait",
      "Fruits à coque",
      "Céleri",
      "Moutarde",
      "Sésame",
      "Sulfites",
      "Lupin",
      "Mollusques",
    ].map((name) => ({ name: name })),
    skipDuplicates: true,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
