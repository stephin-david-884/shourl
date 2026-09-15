import {
    LoginInputDTO,
    LoginOutputDTO,
} from "../../../dtos/auth/login.auth.dto";

export interface ILoginUserUsecase {
    execute(
        data: LoginInputDTO,
    ): Promise<LoginOutputDTO>;
}