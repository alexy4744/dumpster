import { Request } from "express";
import { GridFSBucket } from "mongodb";

export default interface IncomingRequest extends Request {
  bucket: GridFSBucket;
}