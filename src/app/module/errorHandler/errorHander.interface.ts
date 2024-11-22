export interface TErrorDetail {
  message: string;
  name?: string;
  properties?: Record<string, any>;
  kind?: string;
  path?: string;
  value?: any;
}

export interface TErrorResponse {
  message: string;
  success: false;
  error: {
    name: string;
    errors?: Record<string, TErrorDetail>;
  };
  stack?: string;
}
