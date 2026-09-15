import { GetCurrentUserOutputDTO } from "../../../dtos/auth/getCurrentUser.auth.dto";

export interface IGetCurrentUserUseCase {
    execute(
        userId: string,
    ): Promise<GetCurrentUserOutputDTO>;
}