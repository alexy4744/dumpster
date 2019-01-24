import { Express } from "express";
import { Readable } from "stream";

export default interface MulterFile extends Express.Multer.File {
  uid: string;
  stream: Readable;
}