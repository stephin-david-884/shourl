export interface User {
    id: string;
    name: string;
    email: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterResponse {
    user: User;
}

export interface LoginResponse {
    user: User;
}

export type RefreshTokenResponse = Record<string, never>;

export interface CurrentUserResponse {
    user: User;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}