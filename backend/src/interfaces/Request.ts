import { Request } from "express";
import { GridFSBucket } from "mongodb";
import { Mongoose } from "mongoose";

export default interface ExtendedRequest extends Request {
  fileBucket: GridFSBucket;
  mongoose: Mongoose;
}