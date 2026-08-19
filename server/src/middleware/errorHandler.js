import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  logger.error('Error:', {
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || 'Internal Server Error',
  };

  if (isDevelopment) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
