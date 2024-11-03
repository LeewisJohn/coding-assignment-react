import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import toast from 'react-hot-toast';

interface Context {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// can add more type / title...
interface ErrorToastOptions {
  message: string;
}

interface HttpErrorHandlerParams {
  err: FetchBaseQueryError; // The error object from the HTTP response
  errorKeys?: string[]; // Array of keys to look for in the error response
  setFieldErrors?: Record<string, (error: string) => void>; // Function to set field-specific errors
  context?: Context; // Context for managing authentication state
  onCustomError?: () => void; // Optional custom error handling function
}

export const httpErrorHandler = ({
  err,
  errorKeys = [],
  setFieldErrors = {},
  context,
  onCustomError,
}: HttpErrorHandlerParams): void => {
  // Call the custom error handling function if provided
  onCustomError?.();

  // Define different error cases and their corresponding handlers
  const errorCases: Record<number | string, () => void> = {
    400: () => handleBadRequest(err, errorKeys, setFieldErrors), // Handle bad request errors (400)
    401: () => handleUnauthorized(context as Context), // Handle unauthorized errors (401)
    403: () => showErrorToast({ message: 'Permission denied' }),
    404: () => showErrorToast({ message: '404 Ticket not found!' }),
    500: () => showErrorToast({ message: 'Internal Server Error' }),
    "FETCH_ERROR": () => showErrorToast({ message: 'Network Error' }),
    default: () => showErrorToast({ message: 'Something went wrong' }),
  };

  // Determine the error handler based on the error status or use the default handler
  const handleCustomError = errorCases[err?.status ?? 'default'];
  // Execute the determined error handler
  handleCustomError();
};

// Function to handle bad request errors (400)
const handleBadRequest = (
  err: FetchBaseQueryError,
  errorKeys: string[],
  setFieldErrors: Record<string, (error: string) => void>
): void => {
  // Iterate over the specified error keys
  errorKeys?.forEach((key) => {
    // Get the first error message for each key from the error response
    // const firstError = err?.data?.[key]?.[0];
    // if (firstError) {
    //   // Set the field-specific error using the provided setFieldErrors function
    //   setFieldErrors?.[key](firstError);
    // }
  });
};

// Function to handle unauthorized errors (401)
const handleUnauthorized = (context: Context): void => {
  // Show an error toast to notify the user about token expiration
  showErrorToast({
    message: 'Token expired. Please login again.',
  });
  // Clear any stored authentication data
  clearStorage();
  // Update the authentication state in the context
  context?.setIsAuthenticated(false);
};

// A placeholder function for showing error toasts
const showErrorToast = (options: ErrorToastOptions): void => {
  // Implementation to show error toast
  toast.error(options.message);
};

// A placeholder function for clearing stored authentication data
const clearStorage = (): void => {
  // Implementation to clear storage
};
