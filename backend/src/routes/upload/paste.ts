import { Response } from "express";
import { Readable } from "stream";
import { GridFSBucketWriteStream } from "mongodb";

import uid from "uid-safe";

import Request from "@interfaces/Request";

const contentType: string = "application/json";

export default async (req: Request, res: Response): Promise<void> => {
  if (req.headers["content-type"] !== contentType) return;

  const pasteData: string = req.body.paste;

  if (!pasteData) {
    res
      .status(400)
      .send("No paste data found in body!");

    return;
  }

  let stringified: string;

  try {
    stringified = JSON.stringify({ paste: pasteData });
  } catch (error) {
    res
      .status(400)
      .send(error.message);

    return;
  }

  /* Turn the data into a buffer then wrap it as a readable stream so that it can be saved with the GridFS bucket
    https://stackoverflow.com/questions/13230487/converting-a-buffer-into-a-readablestream-in-nodejs */
  const buffer: Buffer = Buffer.from(stringified);
  const readableStream: Readable = new Readable(); // Create a new readable stream with no data

  readableStream.push(buffer); // Put the buffer into the readable stream
  readableStream.push(null);  // Must push null at the end to indicate that it is finished outputting data

  const id: string = await uid(4); // tslint:disable-line newline-per-chained-call
  const uploadStream: GridFSBucketWriteStream = req.fileBucket.openUploadStreamWithId(id, id, {
    contentType,
    metadata: {
      isFile: false
    }
  });

  readableStream // Now save it to the GridFS bucket
    .pipe(uploadStream)
    .on("error", (error: Error): Response => res.status(500).send(error.message)) // tslint:disable-line
    .on("finish", (): Response => res.status(200).send("File uploaded!")); // tslint:disable-line
};