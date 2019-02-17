import { Router, Response, NextFunction } from "express";
import { Cursor } from "mongodb";

import Request from "@interfaces/Request";
import File from "@interfaces/File";

const router: Router = Router();

router.get("/resolve/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const fileCursor: Cursor = req.fileBucket.find({ _id: req.params.id });
    const filesArray: File[] = await fileCursor.toArray();

    if (filesArray.length < 1) throw new Error(`No files found for ${req.params.id}!`);
    if (filesArray.length > 1) throw new Error(`Multiple files found for ${req.params.id}!`);

    const file: File = filesArray[0];

    // res.set({
    //   "Content-Type": file.contentType,
    //   "Content-Length": file.length,
    //   "Content-Disposition": `${file.metadata.isFile ? "attachment" : "inline"}; filename="${file.filename}"`
    // });

    // res.status(200);
    res.send(file);
    // req.fileBucket
    //   .openDownloadStream(req.params.id)
    //   .pipe(res)
    //   .on("error", next)
    //   .on("finish", () => {
    //     res.send(file);
    //   });
  } catch (error) {
    next(error);
  }
});

export default router;