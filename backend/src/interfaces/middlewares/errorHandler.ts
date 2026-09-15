import {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from "express";
import { ZodError } from "zod";

import { AppError } from "../../domain/errors/AppError";
import { statusCode } from "../../application/constants/enums/statusCode";

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    console.error(error);

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });

        return;
    }

    if (error instanceof ZodError) {
        const errorMessage =
            error.issues[0]?.message ?? "Invalid request data";

        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: errorMessage,
        });

        return;
    }

    res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : error instanceof Error
                    ? error.message
                    : "Internal server error",
    });
};