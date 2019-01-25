import { Router } from "express";
import bodyParser from "body-parser";

import uploadFile from "@routes/upload/file";
import uploadPaste from "@routes/upload/paste";
import Configuration from "@/structures/Configuration";

const router: Router = Router();

router
  .post("/file", uploadFile)

  /* Only parse the body for the /paste route */
  .use(bodyParser.json({ limit: Configuration.MAX_PASTE_SIZE }))
  .use(bodyParser.urlencoded({ limit: Configuration.MAX_PASTE_SIZE, extended: true }))
  .post("/paste", uploadPaste);

export default router;