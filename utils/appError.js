function appError(message, statusCode) {
  // Create a new Error object with the provided message
  const error = new Error(message);

  // Add custom properties to the error object
  error.statusCode = statusCode;
  error.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
  error.isOperational = true;

  // Capture the stack trace for debugging
  Error.captureStackTrace(error, appError);

  return error;
}

module.exports = appError;
