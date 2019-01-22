import Console from "@structures/Console";

import Request from "@interfaces/Request";
import { Response } from "express";

import { Readable } from "stream";
import uid from "uid-safe";

const console: Console = new Console();

export default (req: Request, res: Response): void => {
  if (!req.busboy) return;

  req.busboy.on("file", async (fieldname: string, file: Readable, filename: string): Promise<void> => {
    const id: string = await uid(18);

    file
      .pipe(
        req.fileBucket
          .openUploadStreamWithId(id, filename)
          .on("error", console.error.bind(this))
      )
      .on("error", console.error.bind(this));
  });

  req.busboy.on("finish", (): void => {
    req.session.totalFiles ? req.session.totalFiles = 1 : req.session.totalFiles++;
    res.send("File Uploaded!");
  });

  req.pipe(req.busboy);
};