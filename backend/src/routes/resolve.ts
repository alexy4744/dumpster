import { Router, Response, NextFunction } from "express";
import { Cursor } from "mongodb";

import Request from "@interfaces/Request";
import File from "@interfaces/File";

import findFile from "@middleware/findFile";

const router: Router = Router();

router.get("/resolve/:id", [
  findFile, // findFile is a middleware that finds the file and calls next() with the file as a parameter
  async (file: Cursor | Error, req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (file instanceof Error) return next(file);

    // File is a cursor so even though there should only be one file, it has to be iterated
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
        .on("error", next);
    });
  }]
);

export default router;