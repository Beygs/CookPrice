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

// GET /api/ngredient/[slug]
const handleGet = async (slug, session, res) => {
  const ingredient = await prisma.ingredient.findUnique({
    where: {
      slugUserId: {
        userId: session.user.id,
        slug,
      },
    },
  });
  res.json(ingredient);
};

export default handle;
