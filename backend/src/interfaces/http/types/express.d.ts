import { AccessTokenPayload } from "../../../application/interfaces/services/auth/ITokenService";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};