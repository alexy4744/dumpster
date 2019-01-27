import uid from "uid-safe";

import Request from "@interfaces/Request";
import MulterFile from "@interfaces/MulterFile";
import { GridFSBucketWriteStream } from "mongodb";

export default class GridFSStorageEngine {
  public async _handleFile(req: Request, file: MulterFile, callback: (result: MulterFile | Error) => void): Promise<void> { // tslint:disable-line max-line-length
    try {
      const id: string = await uid(4);
      const uploadStream: GridFSBucketWriteStream = req.fileBucket.openUploadStreamWithId(id, file.originalname, {
        contentType: file.mimetype,
        metadata: {
          isFile: true
        }
      });

      file.uid = id;
      file.stream.pipe(uploadStream);

      uploadStream
        .on("error", callback)
        .on("finish", callback);
    } catch (error) {
      callback(error);
    }
  }

  public _removeFile(req: Request, file: MulterFile, callback: (error?: Error) => void): void {
    req.fileBucket.delete(file.uid as any, callback);
  }
}