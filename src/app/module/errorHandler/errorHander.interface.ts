export interface IErrorDetail {
  message: string;
  name?: string;
  properties?: Record<string, any>;
  kind?: string;
  path?: string;
  value?: any;
}

export interface IErrorResponse {
  message: string; // A brief error message
  success: false; // Always false for errors
  error: {
    name: string; // The type of error (e.g., ValidationError)
    errors?: Record<string, IErrorDetail>; // Detailed errors (e.g., field-specific)
  };
  stack?: string; // Stack trace for debugging (optional in production)
}
