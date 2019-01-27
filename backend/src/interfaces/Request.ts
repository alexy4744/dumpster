import { Request } from "express";
import { GridFSBucket, Db } from "mongodb";

export default interface IncomingRequest extends Request {
  database: Db;
  fileBucket: GridFSBucket;
  isProduction: boolean;
}