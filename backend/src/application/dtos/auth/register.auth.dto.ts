export interface RegisterUserInputDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterUserOutputDTO {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}