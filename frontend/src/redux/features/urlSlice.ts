import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import type { AxiosError } from "axios";
import type { ApiResponse } from "../../types/response";

import api from "../../lib/axios";

import { API_ROUTES } from "../../constants/api.routes";

import type {
    CreateShortUrlRequest,
    CreateShortUrlResponse,
    DeleteUrlResponse,
    GetUserUrlsResponse,
    Url,
    UrlState,
} from "../../types/url";

import { logoutUser } from "./authSlice";

const initialState: UrlState = {
    urls: [],
    loading: false,
    creating: false,
    deletingId: null,
    error: null,
};

export const createShortUrl = createAsyncThunk<
    Url,
    CreateShortUrlRequest,
    { rejectValue: string }
>(
    "url/createShortUrl",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post<
                ApiResponse<CreateShortUrlResponse>
            >(API_ROUTES.URLS.BASE, data);

            if (!response.data.success || !response.data.data?.url) {
                return rejectWithValue(
                    response.data.message ||
                    "Failed to create short URL",
                );
            }

            return response.data.data.url;
        } catch (error) {
            const err =
                error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to create short URL",
            );
        }
    },
);

export const fetchUserUrls = createAsyncThunk<
    Url[],
    void,
    { rejectValue: string }
>(
    "url/fetchUserUrls",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<
                ApiResponse<GetUserUrlsResponse>
            >(API_ROUTES.URLS.BASE);

            if (!response.data.success) {
                return rejectWithValue(
                    response.data.message ||
                    "Failed to fetch URLs",
                );
            }

            return response.data.data?.urls ?? [];
        } catch (error) {
            const err =
                error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to fetch URLs",
            );
        }
    },
);

export const deleteShortUrl = createAsyncThunk<
    DeleteUrlResponse,
    string,
    { rejectValue: string }
>(
    "url/deleteShortUrl",
    async (urlId, { rejectWithValue }) => {
        try {
            const response = await api.delete<ApiResponse>(
                API_ROUTES.URLS.BY_ID(urlId),
            );

            if (!response.data.success) {
                return rejectWithValue(
                    response.data.message ||
                    "Failed to delete URL",
                );
            }

            return { urlId };
        } catch (error) {
            const err =
                error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message ||
                "Failed to delete URL",
            );
        }
    },
);

const urlSlice = createSlice({
    name: "url",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(createShortUrl.pending, (state) => {
                state.creating = true;
                state.error = null;
            })

            .addCase(
                createShortUrl.fulfilled,
                (state, action) => {
                    state.creating = false;

                    const alreadyExists = state.urls.some(
                        (url) => url.id === action.payload.id,
                    );

                    if (!alreadyExists) {
                        state.urls.unshift(action.payload);
                    }
                },
            )

            .addCase(
                createShortUrl.rejected,
                (state, action) => {
                    state.creating = false;
                    state.error =
                        action.payload ||
                        "Failed to create short URL";
                },
            )

            .addCase(fetchUserUrls.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                fetchUserUrls.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.urls = action.payload;
                },
            )

            .addCase(
                fetchUserUrls.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload ||
                        "Failed to fetch URLs";
                },
            )

            .addCase(
                deleteShortUrl.pending,
                (state, action) => {
                    state.deletingId = action.meta.arg;
                    state.error = null;
                },
            )

            .addCase(
                deleteShortUrl.fulfilled,
                (state, action) => {
                    state.deletingId = null;
                    state.urls = state.urls.filter(
                        (url) => url.id !== action.payload.urlId,
                    );
                },
            )

            .addCase(
                deleteShortUrl.rejected,
                (state, action) => {
                    state.deletingId = null;
                    state.error =
                        action.payload ||
                        "Failed to delete URL";
                },
            )

            .addCase(logoutUser.fulfilled, () => initialState)
            .addCase(logoutUser.rejected, () => initialState);
    },
});

export const { clearError } = urlSlice.actions;

export default urlSlice.reducer;
