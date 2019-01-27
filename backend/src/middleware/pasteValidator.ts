import { Response, NextFunction } from "express";
import Request from "@interfaces/Request";

const contentType: string = "application/json";

export default (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers["content-type"] !== contentType) {
    res
      .status(415)
      .send({
        message: `Endpoint only accepts ${contentType}, but received ${req.headers["content-type"]}!`
      });

    return;
  }

  let data: string = req.body.paste;

  if (!data) {
    res
      .status(400)
      .send({ message: "No paste data found in body!" });

    return;
  }

  try {
    data = JSON.stringify({ paste: data });
  } catch (error) {
    res
      .status(400)
      .send({ message: req.isProduction ? error.message : error.stack });

    return;
  }

  next(data);
};