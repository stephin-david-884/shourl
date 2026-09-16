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
    createShortUrl,
    deleteShortUrl,
    fetchUserUrls,
} from "../redux/features/urlSlice";

import type { CreateShortUrlRequest } from "../types/url";

export const useUrls = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        urls,
        loading,
        creating,
        deletingId,
        error,
    } = useSelector((state: RootState) => state.url);

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const createUrl = useCallback(
        async (data: CreateShortUrlRequest) => {
            return dispatch(createShortUrl(data)).unwrap();
        },
        [dispatch],
    );

    const fetchUrls = useCallback(
        async () => {
            return dispatch(fetchUserUrls()).unwrap();
        },
        [dispatch],
    );

    const removeUrl = useCallback(
        async (urlId: string) => {
            return dispatch(deleteShortUrl(urlId)).unwrap();
        },
        [dispatch],
    );

    return {
        urls,
        loading,
        creating,
        deletingId,
        error,

        clearError: handleClearError,

        createUrl,
        fetchUrls,
        removeUrl,
    };
};
