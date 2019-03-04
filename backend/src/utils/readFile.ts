import fs from "fs";

export default (path: string): Promise<Buffer> => {
  return new Promise<Buffer>(
    (resolve, reject): void => {
      fs.readFile(
        path,
        (error: NodeJS.ErrnoException, data: Buffer): void => {
          if (error) return reject(error);
          return resolve(data);
        }
      );
    }
  );
};
