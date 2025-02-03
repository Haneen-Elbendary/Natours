const AppError = require('./../utils/appError');

// handle mongoDB errors
const handelCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};
const handelValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input ${errors.join('. ')}`;
  return new AppError(message, 400);
};
// hanle mongoDB driver error
const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate feild value "${value}". please use another value`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // A) API -> like request on postman
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // B) RENDERED website -> we still in dev mode
  console.error('ERROR🙀', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // operational errors , trusted error : send message to the client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // programming or unknown error:don't leak details to the client

    // 1)Log the error
    console.error('ERROR🙀', err);
    // 2)send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
  //B) RENDERED website
  if (err.isOperational) {
    // operational errors , trusted error : send message to the client
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // programming or unknown error:don't leak details to the client
  // 1)Log the error
  console.error('ERROR🙀', err);
  // 2)send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later!'
  });
};
// handle JWT errors
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);
// we will test it again after changing the JWT expiration time! -> and i fixed it 😍
const handleTokenExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);
module.exports = (err, req, res, next) => {
  // console.log('i am in global error handler');
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    // operational errors
    if (error.name === 'CastError') {
      error = handelCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handelValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleTokenExpiredError();
    }
    sendErrorProd(error, req, res);
  }
};
