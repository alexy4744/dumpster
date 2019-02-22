import {
  Request,
  Response,
  NextFunction,
  RequestHandler
} from "express";

import multer from "multer";

import GridFSStorageEngine from "@structures/GridFSStorageEngine";

// tslint:disable-next-line: no-var-requires
const Configuration = require("@/../../config.json");

const upload: RequestHandler = multer({
  storage: new GridFSStorageEngine(),
  limits: {
    files: Configuration.MAX_FIELDS,
    fileSize: Configuration.MAX_FILE_SIZE * 1024 * 1024
  }
}).any();

export default (req: Request, res: Response, next: NextFunction): void => {
  upload(req, res, (error?: Error): void => {
    if (error) return next(error);
    if (!req.files.length) {
      res.status(400).json({
        error: {
          code: 400,
          message: "No files were included!"
        }
      });

      return;
    }

    res.status(200).json({
      data: {
        items: req.files
      }
    });
  });
};