import { Request, Response, NextFunction } from "express";
import z, { ZodSchema } from "zod";
import { AppError } from "../../domain/errors/AppError";
import { statusCode } from "../../application/constants/enums/statusCode";

type RequestProperty = "body" | "query" | "params";

export const validate =
    <T extends ZodSchema, K extends RequestProperty>(schema: T, property: K) =>
        (
            req: Request,
            res: Response,
            next: NextFunction
        ): asserts req is Request & {
            [P in K]: z.infer<T>
        } => {
            const result = schema.safeParse(req[property]);

            if (!result.success) {
                const message = result.error.issues[0]?.message || "Invalid request";
                return next(new AppError(message, statusCode.BAD_REQUEST));
            }
            Object.assign(
                req[property],
                result.data
            );
            next();
        }