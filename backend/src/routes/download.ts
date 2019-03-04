import { Request, Response, NextFunction } from "express";

import IRequest from "@interfaces/IRequest";
import File from "@interfaces/File";

import findFile from "@utils/findFile";

export default (req: Request, res: Response, next: NextFunction): void => {
  const id: string = req.params.id;
  if (!id) return next(new Error("No files were included!"));

  findFile(req as IRequest)
    .then(
      (file: File): void => {
        res.set({
          "Content-Type": file.contentType,
          "Content-Length": file.length,
          "Content-Disposition": `${
            file.contentType.startsWith("image/") ? "inline" : "attachment"
          }; filename=${file.filename};`
        });

        (req as IRequest).bucket
          .openDownloadStream(id as any)
          .pipe(res)
          .on("error", next);
      }
    )
    .catch(next);
};
