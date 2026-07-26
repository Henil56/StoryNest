/**
 * Central Error Handler & Information Leakage Shield.
 * Logs full technical details to console/logging service for debugging,
 * while mapping raw database/system errors to safe, user-friendly messages.
 */

export const sanitizeErrorMessage = (error, fallbackMessage = 'An unexpected error occurred. Please try again.') => {
  // Always log technical details for debugging
  console.error('[Internal Error Detail]:', {
    message: error?.message,
    code: error?.code || error?.status,
    type: error?.type,
    stack: error?.stack,
    cause: error?.cause,
  });

  if (!error) return fallbackMessage;

  const code = error.code || error.status;
  const rawMsg = String(error.message || '').toLowerCase();

  // 1. Authentication & Credentials Errors
  if (code === 401 || rawMsg.includes('invalid credentials') || rawMsg.includes('user_invalid_credentials')) {
    return 'Invalid email or password. Please verify your credentials.';
  }

  // 2. Conflict / Already Exists
  if (code === 409 || rawMsg.includes('already exists') || rawMsg.includes('user_already_exists') || rawMsg.includes('document_already_exists')) {
    return 'An account or item with these details already exists.';
  }

  // 3. Permission & Access Control
  if (code === 403 || rawMsg.includes('unauthorized') || rawMsg.includes('access denied')) {
    return 'You do not have permission to perform this action.';
  }

  // 4. Resource Not Found
  if (code === 404 || rawMsg.includes('not found') || rawMsg.includes('document_not_found')) {
    return 'The requested resource could not be found.';
  }

  // 5. Rate Limit
  if (code === 429 || rawMsg.includes('rate limit') || rawMsg.includes('too many requests')) {
    return 'Too many requests. Please wait a moment before trying again.';
  }

  // 6. Network & Connection Failures
  if (rawMsg.includes('network error') || rawMsg.includes('failed to fetch') || rawMsg.includes('offline')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // 7. Security Check: Redact stack traces, file paths, and database IDs
  if (
    rawMsg.includes('at ') ||
    rawMsg.includes('collection') ||
    rawMsg.includes('database') ||
    rawMsg.includes('exception') ||
    rawMsg.includes('stack') ||
    rawMsg.includes('appwriteexception')
  ) {
    return 'A database service error occurred. Please try again later.';
  }

  // Safe fallback string if message is clean and short
  if (error.message && typeof error.message === 'string' && error.message.length < 100 && !/[/\\{}]/.test(error.message)) {
    return error.message;
  }

  return fallbackMessage;
};

/**
 * Normalizes error throwing inside Appwrite services to prevent raw exception leakage.
 */
export const formatServiceError = (operation, error) => {
  console.error(`[Appwrite Service] ${operation} failed:`, error);
  const cleanMsg = sanitizeErrorMessage(error, `Failed to complete ${operation}.`);
  const err = new Error(cleanMsg);
  err.code = error?.code || error?.status || 'SERVICE_ERROR';
  err.original = error;
  return err;
};
