class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    // console.log('i am in error class!');
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // to make this class don't appear in the stack tracer
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
