import Request from "@interfaces/Request";
import { Response } from "express";

export default (req: Request, res: Response): void => {
  const file = req.fileBucket.find({
    _id: req.params.id
  });

  return console.log(file)

  res.writeHead(200, {
    "Content-Type": "",
    "Content-Length": ""
  })

  req.fileBucket
    .openDownloadStream(req.params.id)
    .pipe(res)
    .on("error", console.error.bind(this));
};