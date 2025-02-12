const mongoose = require('mongoose');
// start the server
const dotenv = require('dotenv');
// we must read the .env file before require express
// bcz variables must be read before the run of the program
dotenv.config({ path: './config.env' });
const app = require('./app');
// console.log(process.env);
// connect to the database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    // console.log(con.connections);
    console.log('database is connected successfully!');
  });
// .catch(err => console.log('an err happend', err));

// // creating a document from tour model
// const testTour = new Tour({
//   name: 'tour4',
//   price: 400
// });
// testTour
//   .save()
//   .then(doc => {
//     console.log(doc, 'the document had been created');
//   })
//   .catch(err => {
//     console.log('Error😒:', err);
//   });
// ##################
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log('app is Running...');
});
// handle unhandled rejected promises from async code
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection server shutting down....');
  server.close(() => {
    process.exit(1);
  });
});

// we now finished our project!!!!!!😊💕💕