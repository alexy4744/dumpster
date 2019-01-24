import { Router, Response } from "express";
import multer from "multer";

import Request from "@interfaces/Request";
import MulterFile from "@interfaces/MulterFile";

import Configuration from "@structures/Configuration";
import GridFSStorageEngine from "@structures/GridFSStorageEngine";

const router: Router = Router();
const upload = multer({
  storage: new GridFSStorageEngine(),
  limits: {
    files: Configuration.MAX_FILES,
    fileSize: Configuration.MAX_FILE_SIZE
  }
}).single("file"); // tslint:disable-line newline-per-chained-call

router.post("/upload", (req: Request, res: Response) => {
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
});

export default router;