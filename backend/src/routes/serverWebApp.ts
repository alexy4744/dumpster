import fs from "fs";
import path from "path";

import {
  Router,
  Request,
  Response,
  NextFunction
} from "express";

const router: Router = Router();

router.get("*", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const file: string = path.join(__dirname, "../../../frontend/dist/index.html");

  try {
    await fs.promises.stat(file); // If this doesn't throw an error, then the file exists.
    res.sendFile(file);
  } catch (error) { // Else toss the error to the error handler
    next();
  }
});

export default router;