// core modules
const express = require('express');
// my modules
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// import error class
const AppError = require('./utils/appError');
// import the error controller||handler
const globalErrorHandler = require('./controllers/globalErrorHandler');
const tourRouter = require('./routes/toursRoute');
const UserRouter = require('./routes/userRoute');
// 3-rd party modules
// const exp = require('constants');
// built-in middleware in express to serve static files
app.use(express.static(`${__dirname}/public`));
// GLOBAL ->  middlewares
// 3-rd party middleware from npm
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limitter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many requests from this IP ,please try again in an hour!'
});
// apply this middleware to all Routes
app.use('/api', limitter);
// this middleware to add body data to the request obj
app.use(express.json());
// create global middlewares -> be careful about middleware order in your code
// app.use((req, res, next) => {
//   console.log('hello from the global middleware');
//   next();
// });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// console.log(tours);

// get method
// app.get('/api/v1/tours', getAllTours);
// post method
// app.post('/api/v1/tours', createTour);
//  get method with defined variables in the URL && in the ROUTE
// app.get('/api/v1/tours/:id', getTour);
// patch method
// app.patch('/api/v1/tours/:id', updateTour);
// delete method
// app.delete('/api/v1/tours/:id', deleteTour);

// use the routers as a middle ware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', UserRouter);
// add a middleware to handle all of not handled routes
// at the end of (middleware stack)
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
  // create the error without use out error class
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);
  // create the error WITH use out error class
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// create a global error handling middleware
// express will automaticlly know that is a global middleware function bcz we passed 4 args
app.use(globalErrorHandler);

module.exports = app;
// ###### -> old code for learning
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'get data now', app: 'natours' });
// });
// app.post('/', (req, res) => {
//   res.status(201).send('You can Post now');
// });
