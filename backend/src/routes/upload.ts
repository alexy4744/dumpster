import { Router } from "express";

/* SUB ROUTES */
import uploadFile from "@routes/upload/file";
import uploadPaste from "@routes/upload/paste";

const router: Router = Router();

router.post("/file", uploadFile);
router.post("/paste", uploadPaste);

export default router;