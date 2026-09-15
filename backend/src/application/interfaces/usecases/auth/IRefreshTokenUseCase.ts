import {
    RefreshTokenInputDTO,
    RefreshTokenOutputDTO,
} from "../../../dtos/auth/refreshToken.auth.dto";

export interface IRefreshTokenUseCase {
    execute(
        data: RefreshTokenInputDTO,
    ): Promise<RefreshTokenOutputDTO>;
}