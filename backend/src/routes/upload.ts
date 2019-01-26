import { Router } from "express";
import bodyParser from "body-parser";

import uploadFile from "@routes/upload/file";
import uploadPaste from "@routes/upload/paste";
import Configuration from "@structures/Configuration";

const router: Router = Router();

router
  .post("/file", uploadFile)
  .use(bodyParser.json({ limit: Configuration.MAX_PASTE_SIZE })) // Only parse the body for the /paste route
  .post("/paste", uploadPaste);

export default router;