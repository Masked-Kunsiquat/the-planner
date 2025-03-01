// src/utils/errorHandler.ts

export class ApiError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  // Standardized error handler
  export function handleApiError(error: any, customMessage?: string) {
    console.error("API Error:", error);
  
    if (error?.response?.data?.message) {
      return new ApiError(error.response.data.message, error.response.status);
    }
  
    return new ApiError(customMessage || "An unexpected error occurred.", 500);
  }
  