import { Router } from "express";

import pasteValidator from "@/middleware/validatePaste";

import uploadFile from "@routes/upload/file";
import uploadPaste from "@routes/upload/paste";

const router: Router = Router();

router
  .post("/file", uploadFile)
  .post("/paste", [pasteValidator, uploadPaste]);

export default router;