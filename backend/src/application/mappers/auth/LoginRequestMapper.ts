import { LoginInputDTO } from "../../dtos/auth/login.auth.dto";

export const mapLoginRequest = (
    body: Record<string, unknown>,
): LoginInputDTO => {
    return {
        email: String(body.email ?? "")
            .trim()
            .toLowerCase(),

        password: String(body.password ?? ""),
    };
};