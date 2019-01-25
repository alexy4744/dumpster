import { Response } from "express";
import multer from "multer";

import Request from "@interfaces/Request";

import Configuration from "@structures/Configuration";
import GridFSStorageEngine from "@structures/GridFSStorageEngine";

const fileUpload = multer({
  storage: new GridFSStorageEngine(),
  limits: {
    files: Configuration.MAX_FILES,
    fileSize: Configuration.MAX_FILE_SIZE
  }
}).single("file"); // tslint:disable-line newline-per-chained-call

export default (req: Request, res: Response): void => {
  fileUpload(req, res, (result: Error | undefined): void => {
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