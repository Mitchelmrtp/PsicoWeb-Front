/**
 * Utility to handle API responses from the Clean Architecture backend
 * The backend now returns responses in this format:
 * {
 *   success: true,
 *   statusCode: 200,
 *   data: { ... actual data ... },
 *   message: "Operation successful",
 *   timestamp: "2025-07-03T00:44:44.417Z"
 * }
 */

export const handleApiResponse = (response) => {
    // If it's already the old format, return as is
    if (response.token || response.user || response.id) {
        return response;
    }
    
    // If it's the new Clean Architecture format, extract the data
    if (response.data && (response.success !== undefined || response.statusCode)) {
        return response.data;
    }
    
    // Default case - return as is
    return response;
};

export const extractApiData = (response) => {
    return handleApiResponse(response);
};

export const isSuccessResponse = (response) => {
    return response.success === true || (response.statusCode >= 200 && response.statusCode < 300);
};

export const getErrorMessage = (response) => {
    if (response.data && response.data.message) {
        return response.data.message;
    }
    if (response.message) {
        return response.message;
    }
    return 'Error desconocido';
};
