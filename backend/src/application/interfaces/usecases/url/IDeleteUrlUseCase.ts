import { DeleteUrlInputDTO } from "../../../dtos/url/deleteUrl.dto";

export interface IDeleteUrlUseCase {
  execute(data: DeleteUrlInputDTO): Promise<void>;
}