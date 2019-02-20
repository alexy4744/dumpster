import { Readable } from "stream";

export default interface MulterFile extends Express.Multer.File {
  id: string;
  stream: Readable;
}