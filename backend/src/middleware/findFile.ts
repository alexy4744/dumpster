import { Response, NextFunction } from "express";
import { Cursor } from "mongodb";

import Request from "@interfaces/Request";

export default (req: Request, res: Response, next: NextFunction): void => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "No file id specified!"
    });

    return;
  }

  const fileCursor: Cursor = req.fileBucket.find({ _id: id });

  fileCursor
    .toArray()
    .then((fileArray: File[]): void => {
      if (!fileArray.length) {
        res.status(400).send({
          message: `No files found for ${id}!`
        });

        return;
      }

      if (fileArray.length > 1) {
        res.status(500).send({
          message: `Multiple files found for ${id}!`
        });

        return;
      }

      const file: File = fileArray[0];

      next(file);
    })
    .catch((error: Error): void => {
      res.status(500).send({
        message: error.message
      });
    });
};