import { Response, NextFunction } from "express";
import { Readable } from "stream";
import { GridFSBucketWriteStream } from "mongodb";

import uid from "uid-safe";

import Request from "@interfaces/Request";

import bufferToReadable from "@utils/bufferToReadable";

const contentType: string = "application/json";

export default async (data: string | Error, req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (data instanceof Error) return next(data);

  const readableStream: Readable = bufferToReadable(Buffer.from(data));
  const id: string = await uid(4);
  const uploadStream: GridFSBucketWriteStream = req.fileBucket.openUploadStreamWithId(id, id, {
    contentType,
    metadata: {
      isFile: false
    }
  });

  readableStream
    .pipe(uploadStream)
    .on("error", next)
    .on("finish", (): void => {
      res
        .status(200)
        .send({
          message: "File uploaded!",
          paste: {
            _id: id,
            data: JSON.parse(data).paste
          }
        });
    });
};