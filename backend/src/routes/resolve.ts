import { Router, Response } from "express";
import { Cursor } from "mongodb";

import Request from "@interfaces/Request";
import File from "@interfaces/File";

import Console from "@structures/Console";

const console: Console = new Console();
const router: Router = Router();

router.get("/resolve/:id", async (req: Request, res: Response): Promise<void> => {
  const file: Cursor = req.fileBucket.find({ _id: req.params.id });
  const exists: number = await file
    .count()
    .catch((error: Error): number => {
      console.error(error);

      // Just send back a 404 error since it can't verify if the file exists or not
      return 0; // tslint:disable-line: newline-before-return
    });

  if (!exists) {
    res
      .status(404)
      .send("File not found!");

    return;
  }

  if (exists > 1) {
    res
      .status(500)
      .send("Found more than one file with the same id...");

    return;
  }

  file.forEach((document: File): void => {
    res.setHeader("Content-Type", document.contentType);
    res.setHeader("Content-Length", document.length);
    res.setHeader(
      "Content-Disposition",
      // If its a file, then make the browser download it, else just view it in the browser since it would be JSON
      `${document.metadata.isFile ? "attachment" : "inline"}; filename="${document.filename}"`
    );

    req.fileBucket
      .openDownloadStream(req.params.id)
      .pipe(res)
      .on("finish", res.status.bind(this, 200))
      .on("error", (error: Error): void => {
        res
          .status(500)
          .send(error.message);

        console.error(error);
      });
  });
});

export default router;