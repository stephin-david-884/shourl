import {
    RegisterUserInputDTO,
    RegisterUserOutputDTO,
} from "../../../dtos/auth/register.auth.dto";

export interface IRegisterUserUsecase {
    execute(
        data: RegisterUserInputDTO,
    ): Promise<RegisterUserOutputDTO>;
}