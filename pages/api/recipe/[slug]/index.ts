import prisma from "lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import slugify from "slugify";

interface Body {
  name: string;
  quantity: string;
  unit: string;
}

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug;
  if (typeof slug !== "string") return res.status(500);

  const session = await getSession({ req });

  switch (req.method) {
    case "GET": {
      return handleGet(slug, session, res);
    }
    case "PUT": {
      return handleUpdate(slug, session, req.body, res);
    }
    case "PATCH": {
      return handleUpdate(slug, session, req.body, res);
    }
    case "DELETE": {
      return handleDelete(slug, session, res);
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

const handleUpdate = async (slug: string, session: Session, body: Body, res: NextApiResponse) => {
  const { name, quantity, unit } = body;

  try {
    const recipe = await prisma.recipe.update({
      where: {
        slugUserId: {
          userId: session.user.id,
          slug,
        }
      },
      data: {
        name,
        quantity: parseInt(quantity),
        unit,
        slug: slugify(name, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
      }
    });

    res.status(200).json(recipe);
  } catch (err) {
    res.status(403).json({ error: err });
  }
}

const handleDelete = async (slug: string, session: Session, res: NextApiResponse) => {
  try {
    await prisma.recipe.delete({
      where: {
        slugUserId: {
          userId: session.user.id,
          slug,
        }
      }
    });

    res.status(200).json({ message: "Deletion complete!" });
  } catch (err) {
    res.status(403).json({ error: err });
  }
}

export default handle;
