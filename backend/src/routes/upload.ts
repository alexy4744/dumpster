import { Router } from "express";

/* SUB ROUTES */
import uploadFile from "./upload/file";
import uploadPaste from "./upload/paste";

const router: Router = Router();

router.post("/file", uploadFile);
router.post("/paste", uploadPaste);

export default router;