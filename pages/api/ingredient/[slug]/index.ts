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

// GET /api/ingredient/[slug]
const handleGet = async (slug: string, session: Session, res: NextApiResponse) => {
  const ingredient = await prisma.ingredient.findUnique({
    where: {
      slugUserId: {
        userId: session.user.id,
        slug,
      },
    },
  });
  res.status(200).json(ingredient);
};

export default handle;
