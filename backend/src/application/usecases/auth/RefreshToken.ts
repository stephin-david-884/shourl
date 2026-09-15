import { AppError } from "../../../domain/errors/AppError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import {
    RefreshTokenInputDTO,
    RefreshTokenOutputDTO,
} from "../../dtos/auth/refreshToken.auth.dto";
import { IHashService } from "../../interfaces/services/auth/IHashService";
import { ITokenService } from "../../interfaces/services/auth/ITokenService";
import { IRefreshTokenUseCase } from "../../interfaces/usecases/auth/IRefreshTokenUseCase";

export class RefreshToken implements IRefreshTokenUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenService: ITokenService,
        private readonly hashService: IHashService,
    ) { }

    async execute(
        data: RefreshTokenInputDTO,
    ): Promise<RefreshTokenOutputDTO> {
        if (!data.token) {
            throw new AppError(
                "Refresh token is required",
                statusCode.UNAUTHORIZED,
            );
        }

        const payload =
            this.tokenService.verifyRefreshToken(data.token);

        if (!payload.userId) {
            throw new AppError(
                "Invalid refresh token",
                statusCode.UNAUTHORIZED,
            );
        }

        const user =
            await this.userRepository.findById(payload.userId);

        if (!user) {
            throw new AppError(
                "User not found",
                statusCode.NOT_FOUND,
            );
        }

        const storedTokens = user.getRefreshTokens();

        let matched = false;
        const remainingTokens: string[] = [];

        for (const hashedToken of storedTokens) {
            const isMatch =
                await this.hashService.compare(
                    data.token,
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

        const newAccessToken =
            this.tokenService.generateAccessToken({
                userId: user.getId(),
                email: user.email,
            });

        const newRefreshToken =
            this.tokenService.generateRefreshToken({
                userId: user.getId(),
            });

        const hashedRefreshToken =
            await this.hashService.hash(newRefreshToken);

        remainingTokens.push(hashedRefreshToken);

        user.setRefreshTokens(remainingTokens);

        await this.userRepository.save(user);

        const csrfToken =
            this.tokenService.generateCsrfToken();

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            csrfToken,
            user: {
                id: user.getId(),
                name: user.name,
                email: user.email,
            },
        };
    }
}