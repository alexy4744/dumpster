import { Cursor } from "mongodb";

import File from "@interfaces/File";
import IRequest from "@interfaces/IRequest";

export default async (req: IRequest): Promise<File> => {
  try {
    const id: string = req.params.id;
    if (!id) return Promise.reject(new Error("No file id provided!"));

    const fileCursor: Cursor = req.bucket.find({ _id: id });
    const filesArray: File[] = await fileCursor.toArray();

    if (filesArray.length < 1) {
      return Promise.reject(new Error(`No files found for ${id}!`));
    } else if (filesArray.length > 1) {
      return Promise.reject(new Error(`Multiple files found for ${id}!`)); // just in case
    }

    const file: File = filesArray[0];

    return Promise.resolve(file);
  } catch (error) {
    return Promise.reject(error);
  }
};