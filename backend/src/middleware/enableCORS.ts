import {
  Request,
  Response,
  NextFunction
} from "express";

export default (req: Request, res: Response, next: NextFunction): void => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
  });

  next();
};