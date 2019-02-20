import { GridFSBucketWriteStream } from "mongodb";
import { StorageEngine } from "multer";

import MulterFile from "@interfaces/MulterFile";
import IRequest from "@interfaces/IRequest";

import generateId from "@utils/generateID";

class GridFSStorageEngine implements StorageEngine {
  public async _handleFile(
    req: IRequest,
    file: MulterFile,
    callback: (error: Error | null, result?: MulterFile) => void
  ): Promise<void> {
    try {
      const id: string = await generateId(3);
      const uploadStream: GridFSBucketWriteStream = req.bucket.openUploadStreamWithId(id, file.originalname, {
        contentType: file.mimetype
      });

      file.id = id;
      file.stream.pipe(uploadStream);

      uploadStream
        .on("error", callback)
        .on("finish", (): void => callback(null, file));
    } catch (error) {
      callback(error);
    }
  }

  public _removeFile(
    req: IRequest,
    file: MulterFile,
    callback: (error: Error) => void
  ): void {
    req.bucket.delete(file.id as any, (err?: Error): void => {
      if (err) return callback(err);
      callback(file as any); // weird type defs for multer or something, should be MulterFile not any.
    });
  }
}

export default GridFSStorageEngine;