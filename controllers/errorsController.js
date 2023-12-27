const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  //   if (process.env.NODE_ENV === 'development') {
  //     sendErrorDev(err, res);
  //   } else if (process.env.NODE_ENV === 'production') {
  //     if (err.name === 'CastError') err = handleCastErrorDB(err);
  //     if (err.code === 11000) err = handleDuplicateFieldDB(err);
  //     if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
  //     if (err.name === 'JsonWebTokenError') err = handleJsonWebTokenError();
  //     if (err.name === 'TokenExpiredError') err = handleTokenExpiredError();
  //     sendErrorProd(err, res);
  //   }
};
