import { nanoid } from "nanoid";

import { IUrlService } from "../../../application/interfaces/services/url/IUrlService";
import { env } from "../../config/env";
 
export class UrlService implements IUrlService {
  async generateCode(): Promise<string> {
    return nanoid(env.SHORT_CODE_LENGTH);
  }
}