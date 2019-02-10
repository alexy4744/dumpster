import {
  Response,
  RequestHandler,
  NextFunction
} from "express";
import multer from "multer";

import Request from "@interfaces/Request";
import MulterFile from "@interfaces/MulterFile";

import GridFSStorageEngine from "@structures/GridFSStorageEngine";

// tslint:disable-next-line: no-var-requires
const Configuration = require("@/../../config.json");

const fileUpload: RequestHandler = multer({
  storage: new GridFSStorageEngine(),
  limits: {
    files: Configuration.MAX_FILE_FIELDS,
    fileSize: Configuration.MAX_FILE_SIZE * 1024 * 1024
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