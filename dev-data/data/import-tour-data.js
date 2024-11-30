const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: `${__dirname}/../../config.env` });
// process.argv -> array of the arguments of the running node process
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
// first read the data from the json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
// import data to the DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// delete data from the DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// to run for delete data  from DB
// node import-tour-data.js --delete
// to run for import data  to DB
// node import-tour-data.js --import
