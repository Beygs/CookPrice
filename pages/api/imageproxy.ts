import { NextApiRequest, NextApiResponse } from "next";

const ImageProxy = async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.query.url !== "string") return res.status(500);
  const url = decodeURIComponent(req.query.url);
  const result = await fetch(url);
  const body: any = result.body;
  body.pipe(res);
}

export default ImageProxy;
