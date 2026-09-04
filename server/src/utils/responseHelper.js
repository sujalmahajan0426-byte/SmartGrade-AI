/**
 * Standardized API Response Envelope (ACP Rule 14)
 */
export const sendResponse = (res, statusCode, data = null, error = null, meta = {}) => {
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        data,
        error,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta,
        },
    });
};

export const sendError = (res, statusCode, message, code = 'INTERNAL_ERROR') => {
    return sendResponse(res, statusCode, null, { message, code });
};
