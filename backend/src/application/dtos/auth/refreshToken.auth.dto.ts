export interface RefreshTokenInputDTO {
    token: string;
}

export interface RefreshTokenOutputDTO {
    accessToken: string;
    refreshToken: string;
    csrfToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}