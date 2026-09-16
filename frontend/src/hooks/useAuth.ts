import { useCallback } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import type {
    AppDispatch,
    RootState,
} from "../redux/store";

import {
    clearError,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshToken,
    registerUser,
} from "../redux/features/authSlice";

import type {
    LoginPayload,
    RegisterPayload,
} from "../types/user";

export const useAuth = () => {
    const dispatch =
        useDispatch<AppDispatch>();

    const {
        user,
        isAuthenticated,
        loading,
        error,
        initialized,
    } = useSelector(
        (state: RootState) => state.auth,
    );

    const handleClearError =
        useCallback(() => {
            dispatch(clearError());
        }, [dispatch]);

    const register = useCallback(
        async (data: RegisterPayload) => {
            return dispatch(
                registerUser(data),
            ).unwrap();
        },
        [dispatch],
    );

    const login = useCallback(
        async (data: LoginPayload) => {
            return dispatch(
                loginUser(data),
            ).unwrap();
        },
        [dispatch],
    );

    const refresh = useCallback(
        async () => {
            return dispatch(
                refreshToken(),
            ).unwrap();
        },
        [dispatch],
    );

    const checkAuth = useCallback(
        async () => {
            try {
                return await dispatch(
                    getCurrentUser(),
                ).unwrap();
            } catch {
                return null;
            }
        },
        [dispatch],
    );

    const logout = useCallback(
        async () => {
            return dispatch(
                logoutUser(),
            ).unwrap();
        },
        [dispatch],
    );

    return {
        user,
        isAuthenticated,
        loading,
        error,
        initialized,

        clearError: handleClearError,

        register,
        login,
        refresh,
        checkAuth,
        logout,
    };
};