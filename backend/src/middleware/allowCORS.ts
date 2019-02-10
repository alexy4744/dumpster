import { Response, NextFunction } from "express";

import Request from "@interfaces/Request";

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
};