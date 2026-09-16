import express from "express";

import {
    tokenService,
    urlController,
} from "../../infrastructure/di/container";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
    "/",
    authMiddleware(tokenService),
    urlController.createShortUrl,
);

router.get(
    "/",
    authMiddleware(tokenService),
    urlController.getUserUrls,
);

router.delete(
    "/:urlId",
    authMiddleware(tokenService),
    urlController.deleteUrl,
);

export default router;