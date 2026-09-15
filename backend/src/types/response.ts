export interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code?: string;
        details?: unknown;
    };
};