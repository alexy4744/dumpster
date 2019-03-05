import { Request, Response, NextFunction } from "express";

import IRequest from "@interfaces/IRequest";
import File from "@interfaces/File";

import findFile from "@utils/findFile";

// Only allow these file types to be displayed in the browser instead of being downloaded
const inlineTypes: string[] = [
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/x-icon",
  "image/svg+xml",

  "audio/mpeg",
  "audio/x-wav",

  "video/mp4"
];

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
            inlineTypes.includes(file.contentType) ? "inline" : "attachment"
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
