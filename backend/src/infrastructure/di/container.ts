import "../config/env";

import { HashService } from "../services/auth/HashService";
import { TokenService } from "../services/auth/TokenService";
import { UrlService } from "../services/url/UrlService";

import { UserRepository } from "../repositories/UserRepository";
import { UrlRepository } from "../repositories/UrlRepository";

import { RegisterUser } from "../../application/usecases/auth/RegisterUser";
import { LoginUser } from "../../application/usecases/auth/LoginUser";
import { RefreshToken } from "../../application/usecases/auth/RefreshToken";
import { GetCurrentUser } from "../../application/usecases/auth/GetCurrentUser";
import { Logout } from "../../application/usecases/auth/Logout";

import { CreateShortUrl } from "../../application/usecases/url/CreateShortUrl";
import { GetUserUrls } from "../../application/usecases/url/GetUserUrls";
import { DeleteUrl } from "../../application/usecases/url/DeleteUrl";
import { RedirectUrl } from "../../application/usecases/url/RedirectUrl";

import { AuthController } from "../../interfaces/controllers/auth/AuthController";
import { UrlController } from "../../interfaces/controllers/url/UrlController";

import { IRegisterUserUsecase } from "../../application/interfaces/usecases/auth/IRegisterUserUsecase";
import { ILoginUserUsecase } from "../../application/interfaces/usecases/auth/ILoginUserUsecase";
import { IRefreshTokenUseCase } from "../../application/interfaces/usecases/auth/IRefreshTokenUseCase";
import { IGetCurrentUserUseCase } from "../../application/interfaces/usecases/auth/IGetCurrentUserUseCase";
import { ILogoutUseCase } from "../../application/interfaces/usecases/auth/ILogoutUseCase";

import { ICreateShortUrlUseCase } from "../../application/interfaces/usecases/url/ICreateShortUrlUseCase";
import { IGetUserUrlsUseCase } from "../../application/interfaces/usecases/url/IGetUserUrlsUseCase";
import { IDeleteUrlUseCase } from "../../application/interfaces/usecases/url/IDeleteUrlUseCase";
import { IRedirectUrlUseCase } from "../../application/interfaces/usecases/url/IRedirectUrlUseCase";

// Repositories

const userRepository = new UserRepository();
const urlRepository = new UrlRepository();

// Services

const hashService = new HashService();
const tokenService = new TokenService();
const urlService = new UrlService();

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

const createShortUrl: ICreateShortUrlUseCase =
  new CreateShortUrl(
    urlRepository,
    urlService,
  );

const getUserUrls: IGetUserUrlsUseCase =
  new GetUserUrls(urlRepository);

const deleteUrl: IDeleteUrlUseCase =
  new DeleteUrl(urlRepository);

const redirectUrl: IRedirectUrlUseCase =
  new RedirectUrl(urlRepository);

// Controllers

export const authController =
  new AuthController(
    registerUser,
    loginUser,
    refreshToken,
    getCurrentUser,
    logout,
  );

export const urlController =
  new UrlController(
    createShortUrl,
    getUserUrls,
    deleteUrl,
    redirectUrl,
  );  

export { tokenService };