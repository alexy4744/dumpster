import { Response } from "express";

import multer from "multer";
import GridFSStorageEngine from "@structures/GridFSStorageEngine";

import Request from "@interfaces/Request";
import MulterFile from "@interfaces/MulterFile";

import Configuration from "@structures/Configuration";

const upload = multer({
  storage: new GridFSStorageEngine(),
  limits: {
    files: Configuration.MAX_FILES,
    fileSize: Configuration.MAX_FILE_SIZE
  }
}).single("file"); // tslint:disable-line newline-per-chained-call

export default (req: Request, res: Response): void => {
  upload(req, res, (result: MulterFile | Error | undefined): void => {
    if (!result) {
      res
        .status(400)
        .send("Empty upload!");
    } else if (result instanceof Error) {
      res
        .status(400)
        .send(result.message);
    } else {
      res
        .status(200)
        .send("File uploaded!");
    }
  });
};