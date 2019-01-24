import Console from "@structures/Console";

import Request from "@interfaces/Request";
import File from "@interfaces/File";

import { Response } from "express";
import { Cursor } from "mongodb";

const console: Console = new Console();

export default async (req: Request, res: Response): Promise<void> => {
  const file: Cursor = req.fileBucket.find({
    _id: req.params.id
  });

  const exists: number = await file
    .count()
    .catch((error: Error): number => {
      console.error(error);
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
    res.writeHead(200, {
      "Content-Type": document.contentType,
      "Content-Length": document.length,
      "Content-Disposition": `attachment; filename="${document.filename}"`
    });

    req.fileBucket
      .openDownloadStream(req.params.id)
      .pipe(res)
      .on("error", console.error.bind(this))
      .on("finish", res.status.bind(this, 200));
  });
};