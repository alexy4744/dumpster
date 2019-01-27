import { Response, RequestHandler, NextFunction } from "express";
import multer from "multer";

import Request from "@interfaces/Request";
import MulterFile from "@interfaces/MulterFile";

import Configuration from "@structures/Configuration";
import GridFSStorageEngine from "@structures/GridFSStorageEngine";

const fileUpload: RequestHandler = multer({
  storage: new GridFSStorageEngine(),
  limits: {
    files: Configuration.MAX_FILES,
    fileSize: Configuration.MAX_FILE_SIZE
  }
}).single("file"); // tslint:disable-line newline-per-chained-call

export default (req: Request, res: Response, next: NextFunction): void => {
  fileUpload(req, res, (result: MulterFile | Error | undefined): void => {
    if (result instanceof Error) return next(result);

    if (!result) {
      res
        .status(400)
        .send({ message: "Empty upload!" });
    } else {
      res
        .status(200)
        .send({
          message: "File uploaded!",
          file: result
        });
    }
  });
};