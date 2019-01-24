import uid from "uid-safe";

import Request from "@interfaces/Request";
import MulterFile from "@interfaces/MulterFile";

export default class GridFSStorageEngine {
  public async _handleFile(req: Request, file: MulterFile, callback: (result: MulterFile | Error) => void): Promise<void> { // tslint:disable-line max-line-length
    try {
      const id: string = await uid(4); // tslint:disable-line newline-per-chained-call

      // Add an uid field to the file so that it can be used as a reference to delete the file in _removeFile()
      file.uid = id;

      file.stream
        .pipe(
          req.fileBucket
            .openUploadStreamWithId(id, file.originalname, {
              contentType: file.mimetype
            })
            .on("error", callback)
        )
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