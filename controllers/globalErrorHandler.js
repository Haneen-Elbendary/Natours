const AppError = require('./../utils/appError');
const cloneError = err => {
  const descriptors = Object.getOwnPropertyDescriptors(err);
  return Object.create(Object.getPrototypeOf(err), descriptors);
};
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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const sendErrorProd = (err, res) => {
  // operational errors , trusted error : send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // programming or unknown error:don't leak details to the client
  } else {
    // 1)Log the error
    console.error('ERROR🙀', err);
    // 2)send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};
module.exports = (err, req, res, next) => {
  // console.log('i am in global error handler');
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = cloneError(err);
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

    sendErrorProd(error, res);
  }
};
