import { AppError } from "../../../domain/errors/AppError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import {
    LoginInputDTO,
    LoginOutputDTO,
} from "../../dtos/auth/login.auth.dto";
import { IHashService } from "../../interfaces/services/auth/IHashService";
import { ITokenService } from "../../interfaces/services/auth/ITokenService";
import { ILoginUserUsecase } from "../../interfaces/usecases/auth/ILoginUserUsecase";

export class LoginUser implements ILoginUserUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenService: ITokenService,
        private readonly hashService: IHashService,
    ) { }

    async execute(
        data: LoginInputDTO,
    ): Promise<LoginOutputDTO> {
        const email = data.email.trim().toLowerCase();

        const user =
            await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError(
                "Invalid email or password",
                statusCode.UNAUTHORIZED,
            );
        }

        const password = user.getPassword();

        if (!password) {
            throw new AppError(
                "Invalid email or password",
                statusCode.UNAUTHORIZED,
            );
        }

        const isValidPassword =
            await this.hashService.compare(
                data.password,
                password,
            );

        if (!isValidPassword) {
            throw new AppError(
                "Invalid email or password",
                statusCode.UNAUTHORIZED,
            );
        }

        const accessToken =
            this.tokenService.generateAccessToken({
                userId: user.getId(),
                email: user.email,
            });

        const refreshToken =
            this.tokenService.generateRefreshToken({
                userId: user.getId(),
            });

        user.addRefreshToken(refreshToken);

        await this.userRepository.save(user);

        const csrfToken =
            this.tokenService.generateCsrfToken();

        return {
            success: true,
            accessToken,
            refreshToken,
            csrfToken,
            user: {
                id: user.getId(),
                name: user.name,
                email: user.email,
            },
        };
    }
}