import prisma from "lib/prismaClient";
import { getSession } from "next-auth/react";

const handle = async (req, res) => {
  const slug = req.query.slug;
  const session = await getSession({ req });

  switch (req.method) {
    case "GET": {
      return handleGet(slug, session, res);
    }
    default: {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  }
};

// GET /api/recipe/[slug]
const handleGet = async (slug, session, res) => {
  const recipe = await prisma.recipe.findUnique({
    where: {
      slugUserId: {
        userId: session.user.id,
        slug,
      },
    },
    include: {
      ingredients: {
        include: {
          ingredient: {
            select: {
              name: true,
              allergens: true,
              price: true,
              unit: true,
              slug: true,
              id: true,
            },
          },
        },
      },
    },
  });

  res.json(recipe);
};

export default handle;
