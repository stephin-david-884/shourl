import { User } from "../../../domain/entities/User.entity";
import { AppError } from "../../../domain/errors/AppError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { RegisterUserInputDTO, RegisterUserOutputDTO } from "../../dtos/auth/register.auth.dto";
import { IHashService } from "../../interfaces/services/auth/IHashService";
import { ITokenService } from "../../interfaces/services/auth/ITokenService";
import { IRegisterUserUsecase } from "../../interfaces/usecases/auth/IRegisterUserUsecase";

export class RegisterUser implements IRegisterUserUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly hashService: IHashService,
        private readonly tokenService: ITokenService,
    ) { }

    async execute(
        data: RegisterUserInputDTO,
    ): Promise<RegisterUserOutputDTO> {
        const {
            name,
            email,
            password,
            confirmPassword,
        } = data;

        if (password !== confirmPassword) {
            throw new AppError(
                "Passwords do not match",
                statusCode.BAD_REQUEST,
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser =
            await this.userRepository.findByEmail(normalizedEmail);

        if (existingUser) {
            throw new AppError(
                "User with this email already exists",
                statusCode.CONFLICT,
            );
        }

        const hashedPassword =
            await this.hashService.hash(password);

        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        const createdUser =
            await this.userRepository.save(user);

        const accessToken =
            this.tokenService.generateAccessToken({
                userId: createdUser.getId(),
                email: createdUser.email,
            });

        const refreshToken =
            this.tokenService.generateRefreshToken({
                userId: createdUser.getId(),
            });

        const hashedRefreshToken =
            await this.hashService.hash(refreshToken);

        createdUser.addRefreshToken(hashedRefreshToken);

        await this.userRepository.save(createdUser);

        const csrfToken =
            this.tokenService.generateCsrfToken();

        return {
            success: true,
            accessToken,
            refreshToken,
            csrfToken,
            user: {
                id: createdUser.getId(),
                name: createdUser.name,
                email: createdUser.email,
            },
        };
    }
}