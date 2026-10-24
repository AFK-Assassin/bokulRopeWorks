export const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Log full error details server-side (never expose to client in prod)
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
  if (!isProduction) {
    console.error('[Stack]:', err.stack);
  }

  // Determine appropriate HTTP status code
  // res.statusCode defaults to 200 for unhandled errors, so treat as 500
  const statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500
      ? 'An internal server error occurred. Please try again later.'
      : (err.message || 'Internal Server Error'),
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
