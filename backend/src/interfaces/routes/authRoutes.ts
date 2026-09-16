import express from "express";

import {
    authController,
    tokenService,
} from "../../infrastructure/di/container";

import { ROUTES } from "../../shared/constants/routes";

import { registerSchema } from "../validators/auth/registerValidator";
import { loginSchema } from "../validators/auth/loginValidator";

import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
    ROUTES.AUTH.REGISTER,
    validate(registerSchema, "body"),
    authController.register,
);

router.post(
    ROUTES.AUTH.LOGIN,
    validate(loginSchema, "body"),
    authController.login,
);

router.post(
    ROUTES.AUTH.REFRESH_TOKEN,
    authController.refreshToken,
);

router.get(
    ROUTES.AUTH.GET_ME,
    authMiddleware(tokenService),
    authController.getCurrentUser,
);

router.post(
    ROUTES.AUTH.LOGOUT,
    authController.logout,
);

export default router;