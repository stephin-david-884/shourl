import { AppError } from "../../../domain/errors/AppError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { LogoutInputDTO } from "../../dtos/auth/logout.auth.dto";
import { IHashService } from "../../interfaces/services/auth/IHashService";
import { ITokenService } from "../../interfaces/services/auth/ITokenService";
import { ILogoutUseCase } from "../../interfaces/usecases/auth/ILogoutUseCase";

export class Logout implements ILogoutUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenService: ITokenService,
        private readonly hashService: IHashService,
    ) { }

    async execute(data: LogoutInputDTO): Promise<void> {
        if (!data.refreshToken) {
            throw new AppError(
                "Refresh token is required",
                statusCode.UNAUTHORIZED,
            );
        }

        const payload =
            this.tokenService.verifyRefreshToken(
                data.refreshToken,
            );

        const user =
            await this.userRepository.findById(
                payload.userId,
            );

        if (!user) {
            throw new AppError(
                "User not found",
                statusCode.NOT_FOUND,
            );
        }

        const storedTokens =
            user.getRefreshTokens();

        let matched = false;

        const remainingTokens: string[] = [];

        for (const hashedToken of storedTokens) {
            const isMatch =
                await this.hashService.compare(
                    data.refreshToken,
                    hashedToken,
                );

            if (isMatch) {
                matched = true;
                continue;
            }

            remainingTokens.push(hashedToken);
        }

        if (!matched) {
            throw new AppError(
                "Invalid refresh token",
                statusCode.UNAUTHORIZED,
            );
        }

        user.setRefreshTokens(remainingTokens);

        await this.userRepository.save(user);
    }
}