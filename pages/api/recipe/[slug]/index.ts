import prisma from "lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug;
  if (typeof slug !== "string") return res.status(500);

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
const handleGet = async (slug: string, session: Session, res: NextApiResponse) => {
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
          recipe: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  res.json(recipe);
};

export default handle;
