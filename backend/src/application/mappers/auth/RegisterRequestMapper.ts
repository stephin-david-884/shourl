import { RegisterUserInputDTO } from "../../dtos/auth/register.auth.dto";

export const mapRegisterRequest = (
    body: Record<string, unknown>,
): RegisterUserInputDTO => {
    return {
        name: String(body.name ?? ""),
        email: String(body.email ?? "")
            .trim()
            .toLowerCase(),
        password: String(body.password ?? ""),
        confirmPassword: String(body.confirmPassword ?? ""),
    };
};