import {
  Router,
  Request,
  Response
} from "express";

import multer, { Instance } from "multer";

import GridFSStorageEngine from "@structures/GridFSStorageEngine";

// tslint:disable-next-line: no-var-requires
const Configuration = require("@/../../config.json");

const router: Router = Router();
const upload: Instance = multer({
  storage: new GridFSStorageEngine(),
  limits: {
    files: Configuration.MAX_FIELDS,
    fileSize: Configuration.MAX_FILE_SIZE * 1024 * 1024
  }
});

router.post("/upload", upload.any(), (req: Request, res: Response): void => {
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

export default router;