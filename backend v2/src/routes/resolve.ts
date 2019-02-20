import {
  Router,
  Request,
  Response,
  NextFunction
} from "express";

import File from "@interfaces/File";
import IRequest from "@interfaces/IRequest";

import findFile from "@utils/findFile";

const router: Router = Router();

router.get("/resolve/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.params.id) return next(new Error("No file id provided!"));

  findFile(req as IRequest)
    .then((file: File): void => {
      res.json({
        data: {
          items: [file]
        }
      });
    }).catch(next);
});

export default router;