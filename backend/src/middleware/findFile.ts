import { Response, NextFunction } from "express";
import { Cursor } from "mongodb";

import Request from "@interfaces/Request";

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const file: Cursor = req.fileBucket.find({ _id: req.params.id });

  try {
    const exists: number | null = await file.count();

    if (!exists) {
      res
        .status(404)
        .send({ message: "File not found!" });

      return;
    }
  } catch (error) {
    next(error);
  }

  next(file);
};