// core modules
const express = require('express');
const path = require('path');
// my modules
const app = express();
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const sanitizeMongo = require('express-mongo-sanitize');
// eslint-disable-next-line import/no-extraneous-dependencies
const xss = require('xss-clean');
// eslint-disable-next-line import/no-extraneous-dependencies
const hpp = require('hpp');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
// import error class
const AppError = require('./utils/appError');
// import the error controller||handler
const globalErrorHandler = require('./controllers/globalErrorHandler');
const tourRouter = require('./routes/toursRoute');
const UserRouter = require('./routes/userRoute');
const ReviewRouter = require('./routes/reviewsRoute');
const viewsRouter = require('./routes/viewsRoute');

//we needed to add this headers to the helmet to allow access to the scripts and needed assets that was prevented by CSP && cors
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://api.mapbox.com https://cdnjs.cloudflare.com; " + // Added CDN for Axios
      "style-src 'self' https://api.mapbox.com https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https://api.mapbox.com; " +
      "connect-src 'self' https://api.mapbox.com; " +
      "worker-src 'self' https://api.mapbox.com; " +
      "frame-src 'self' https://api.mapbox.com;"
  );
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// use pug template engine
app.set('view engine', 'pug');
// views -> MVC
app.set('views', path.join(__dirname, 'views'));
// GLOBAL ->  middlewares
// 3-rd party middleware from npm
// secure Express app by setting http response headers
//we needed to add this headers to the helmet to allow access to the scripts and needed assets that was prevented by CSP && cors
// that make the helmet accept some configurations
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://cdnjs.cloudflare.com', // Added for Axios CDN
          "'unsafe-inline'",
          "'unsafe-eval'"
        ],
        styleSrc: [
          "'self'",
          'https://api.mapbox.com',
          'https://fonts.googleapis.com',
          "'unsafe-inline'"
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://api.mapbox.com'],
        connectSrc: [
          "'self'",
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://a.tiles.mapbox.com',
          'https://b.tiles.mapbox.com',
          'https://c.tiles.mapbox.com',
          'https://d.tiles.mapbox.com',
          'blob:',
          'data:'
        ],
        workerSrc: ["'self'", 'blob:', 'data:'],
        frameSrc: ["'self'", 'https://api.mapbox.com']
      }
    }
  })
);

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// limit the number of request from the same ip to the same route
const limitter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many requests from this IP ,please try again in an hour!'
});
// apply this middleware to all Routes
app.use('/api', limitter);
// body parser -> this middleware to parse body data and add it to  the request body
app.use(express.json({ limit: '10kb' }));
// form body parser -> extended: true allow us to pass more complex data
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// cookie parser -> used to parse cookies from the request
app.use(cookieParser());
// data sanitization against NOSQL query injection
app.use(sanitizeMongo());
// data sanitization against XSS
app.use(xss());
// prevent parameter pollution
app.use(
  hpp({
    // allow these parameters to be duplicated & prevent other parameters
    whitelist: [
      'price',
      'difficulty',
      'maxGroupSize',
      'duration',
      'ratingsQuantity',
      'ratingsAverage'
    ]
  })
);
// create global middlewares -> be careful about middleware order in your code
// app.use((req, res, next) => {
//   console.log('hello from the global middleware');
//   next();
// });
// testing middleware -> ex:helps id we want to see the headers
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
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
app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/reviews', ReviewRouter);
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
