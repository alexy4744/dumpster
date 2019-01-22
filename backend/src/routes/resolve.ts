import { Router } from "express";

/* SUB ROUTES */
import resolveFile from "./resolve/file";
import resolvePaste from "./resolve/paste";

const router: Router = Router();

router.get("/file/:id", resolveFile);
router.get("/paste/:id", resolvePaste);

export default router;