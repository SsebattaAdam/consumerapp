// App Error Messages Constants

export const APP_ERRORS = {
  // Authentication Errors
  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
    INVALID_CREDENTIALS_DETAILED: "Invalid email or password. Please check your credentials and try again.",
    CREDENTIALS_REQUIRED: "Email and password are required.",
    LOGIN_FAILED: "Login failed. Please try again.",
    REGISTRATION_FAILED: "Registration failed. Please try again.",
    AUTHENTICATION_FAILED: "Authentication failed. Please try again.",
    TOKEN_NOT_RECEIVED: "Authentication token not received.",
    SERVICE_UNAVAILABLE: "Authentication service is not available. Please try again.",
  },

  // HTTP Status Code Errors
  HTTP: {
    BAD_REQUEST: "Invalid request. Please check your input and try again.",
    UNAUTHORIZED: "Invalid email or password. Please try again.",
    FORBIDDEN: "Access denied. You don't have permission to perform this action.",
    NOT_FOUND: "The requested resource was not found. Please contact support.",
    SERVER_ERROR: "Server error. Please try again later.",
    SERVICE_UNAVAILABLE: "Service is temporarily unavailable. Please try again later.",
    NETWORK_ERROR: "Unable to connect. Please check your internet connection and try again.",
    TIMEOUT: "Request timeout. Please try again.",
  },

  // Generic Errors
  GENERIC: {
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
    INVALID_RESPONSE: "Invalid response from server.",
    CONNECTION_ERROR: "Unable to connect to the server. Please check your internet connection.",
  },
};

// Helper function to get error message based on HTTP status code
export const getErrorMessage = (error: any): string => {
  if (error?.response?.status) {
    const status = error.response.status;

    switch (status) {
      case 400:
        return error?.response?.data?.message || 
               error?.response?.data?.error || 
               APP_ERRORS.HTTP.BAD_REQUEST;
      
      case 401:
        return error?.response?.data?.message || 
               APP_ERRORS.HTTP.UNAUTHORIZED;
      
      case 403:
        return error?.response?.data?.message || 
               APP_ERRORS.HTTP.FORBIDDEN;
      
      case 404:
        return error?.response?.data?.message || 
               APP_ERRORS.HTTP.NOT_FOUND;
      
      case 500:
      case 502:
      case 503:
      case 504:
        return error?.response?.data?.message || 
               APP_ERRORS.HTTP.SERVER_ERROR;
      
      default:
        if (status >= 500) {
          return APP_ERRORS.HTTP.SERVER_ERROR;
        }
        return error?.response?.data?.message || 
               APP_ERRORS.GENERIC.UNKNOWN_ERROR;
    }
  }

  // Handle network errors
  if (error?.message) {
    if (error.message.includes('timeout')) {
      return APP_ERRORS.HTTP.TIMEOUT;
    }
    if (error.message.includes('Network Error') || error.message.includes('network')) {
      return APP_ERRORS.HTTP.NETWORK_ERROR;
    }
    // Return the error message if it's already user-friendly
    return error.message;
  }

  // Default error
  return APP_ERRORS.GENERIC.CONNECTION_ERROR;
};

// Helper function to get authentication-specific error message
export const getAuthErrorMessage = (error: any): string => {
  if (error?.response?.status === 400) {
    return error?.response?.data?.message || 
           error?.response?.data?.error ||
           APP_ERRORS.AUTH.INVALID_CREDENTIALS_DETAILED;
  }
  
  if (error?.response?.status === 401) {
    return error?.response?.data?.message || 
           APP_ERRORS.AUTH.INVALID_CREDENTIALS;
  }
  
  return getErrorMessage(error);
};



