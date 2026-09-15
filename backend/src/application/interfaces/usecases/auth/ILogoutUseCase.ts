import { LogoutInputDTO } from "../../../dtos/auth/logout.auth.dto";

export interface ILogoutUseCase {
    execute(data: LogoutInputDTO): Promise<void>;
}