import prisma from "lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface Body {
  gazPrice: string;
  electricityPrice: string;
  deliveryPrice: string;
}

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  switch (req.method) {
    case "PATCH": {
      handleUpdate(req.body, session.user, res);
      break;
    }
    case "PUT": {
      handleUpdate(req.body, session.user, res);
      break;
    }
    default: {
      res.status(403).json({ error: `The HTTP ${req.method} method is not supported at this route.` });
    }
  }
};

const handleUpdate = async (
  body: Body,
  user: Session["user"],
  res: NextApiResponse
) => {
  try {
    const response = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        gazPrice: parseFloat(body.gazPrice),
        electricityPrice: parseFloat(body.electricityPrice),
        deliveryPrice: parseFloat(body.deliveryPrice),
      },
    });
  
    res.status(200).json({ user: response });
  } catch (err) {
    res.status(403).json({ error: err });
  }
};

export default handle;
