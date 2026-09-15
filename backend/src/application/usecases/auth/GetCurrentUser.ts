import { AppError } from "../../../domain/errors/AppError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { GetCurrentUserOutputDTO } from "../../dtos/auth/getCurrentUser.auth.dto";
import { IGetCurrentUserUseCase } from "../../interfaces/usecases/auth/IGetCurrentUserUseCase";

export class GetCurrentUser implements IGetCurrentUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(
        userId: string,
    ): Promise<GetCurrentUserOutputDTO> {
        const user =
            await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError(
                "User not found",
                statusCode.NOT_FOUND,
            );
        }

        return {
            id: user.getId(),
            name: user.name,
            email: user.email,
        };
    }
}