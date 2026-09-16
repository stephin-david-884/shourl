import "../config/env";

import { HashService } from "../services/auth/HashService";
import { TokenService } from "../services/auth/TokenService";

import { UserRepository } from "../repositories/UserRepository";

import { RegisterUser } from "../../application/usecases/auth/RegisterUser";
import { LoginUser } from "../../application/usecases/auth/LoginUser";
import { RefreshToken } from "../../application/usecases/auth/RefreshToken";
import { GetCurrentUser } from "../../application/usecases/auth/GetCurrentUser";
import { Logout } from "../../application/usecases/auth/Logout";

import { AuthController } from "../../interfaces/controllers/auth/AuthController";

import { IRegisterUserUsecase } from "../../application/interfaces/usecases/auth/IRegisterUserUsecase";
import { ILoginUserUsecase } from "../../application/interfaces/usecases/auth/ILoginUserUsecase";
import { IRefreshTokenUseCase } from "../../application/interfaces/usecases/auth/IRefreshTokenUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/usecases/auth/IGetCurrentUserUseCase";
import { ILogoutUseCase } from "../../application/interfaces/usecases/auth/ILogoutUseCase";

// Repositories

const userRepository = new UserRepository();

// Services

const hashService = new HashService();
const tokenService = new TokenService();

// Use cases

const registerUser: IRegisterUserUsecase =
  new RegisterUser(
    userRepository,
    hashService,
    tokenService,
  );

const loginUser: ILoginUserUsecase =
  new LoginUser(
    userRepository,
    tokenService,
    hashService,
  );

const refreshToken: IRefreshTokenUseCase =
  new RefreshToken(
    userRepository,
    tokenService,
    hashService,
  );

const getCurrentUser: IGetCurrentUserUseCase =
  new GetCurrentUser(userRepository);

const logout: ILogoutUseCase =
  new Logout(
    userRepository,
    tokenService,
    hashService,
  );

// Controllers

export const authController =
  new AuthController(
    registerUser,
    loginUser,
    refreshToken,
    getCurrentUser,
    logout,
  );

export { tokenService };