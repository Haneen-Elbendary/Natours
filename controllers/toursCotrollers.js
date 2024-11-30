//import tour model
const Tour = require('./../models/tourModel');
// import the class that include api features
const APIFeatures = require('./../utils/apiFeatures');
// to handle catch in async functions -> get rid of try & catch block
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
// CODE for practicing
// Rout handlers 4 tours
// const fs = require('fs');
// read the file sync in the top-level-code so it will be excuted once
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// param middleware function
// exports.checkID = (req, res, next, val) => {
//   console.log(`i am in a param middleware that check the id validation before excute any middlewares
//     such as controllers : ${val}`);
//   // if (req.params.id * 1 > tours.length) {
//   //   return res.status(404).json({
//   //     status: 'failed',
//   //     message: 'Not valid ID'
//   //   });
//   // }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'failed',
//       message: 'body must contain name && price'
//     });
//   }
//   next();
// };
// ##################################################################################################
// get top 5 cheap tours
exports.alisTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,summary,price,ratingsAverage,difficulty';
  next();
};
// create a util class for APIFeatures
// we will get rid off try & catch block by wrap the code with a function that return our function with catch & with add error to next in catch to pass it to the global middleware handler

exports.getAllTours = catchAsync(async (req, res, next) => {
  // OLD version
  // res.status(200).json({
  //   status: 'success',
  //   requestedAt: req.requestTime,
  //   results: tours.length,
  //   data: {
  //     tours
  //   }
  // });
  // #################################################NEW VERSION
  // console.log(req.query);
  // create new obj from req.query
  // the way using mongoose methods
  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5);
  // console.log(req.query);
  // 1A - simple filtering
  // const queryObj = { ...req.query };
  // const excludedFeilds = ['page', 'sort', 'limit', 'fields'];
  // excludedFeilds.forEach(el => delete queryObj[el]);
  // // 1B - Advanced  filtering
  // let queryStr = JSON.stringify(queryObj);
  // //  \b      -> to ensure it is match the exact word not a piece  of other word
  // queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`);
  // // console.log(JSON.parse(queryStr));
  // let query = Tour.find(JSON.parse(queryStr));
  // 2- sorting -> the value inside the sort is string
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }
  // 3- feilds -> let the user choose which feilds to get back in the response
  // we can't use inclusive and exclusive fields at the same time in select method
  // if (req.query.fields) {
  //   const selectedFeilds = req.query.fields.split(',').join(' ');
  //   query = query.select(selectedFeilds);
  // } else {
  //   // exclusive __v field from the output
  //   query = query.select('-__v');
  // }
  // 4- pagination
  // the default pagination will be page =1 & limit = 100
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // // skip formula (page -1 )* limit -> to skip the documents of the previous pages
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // // check if the required page doesn't exist
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   // I throwed error here to go to the catch block
  //   if (skip >= numTours) throw new Error('this page is not Exist!');
  // }
  // create the query
  const featurs = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFeilds()
    .paginate();
  // excude the query
  const tours = await featurs.query;
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
});
//  let query = Tour.find(JSON.parse(queryStr));
exports.getTour = catchAsync(async (req, res, next) => {
  // OLD version
  //   console.log(req.params.id);
  // to convert the 'string number to number'
  // const tourId = req.params.id * 1;
  // //   console.log(tourId);
  // const tour = tours.find(el => el.id === tourId);
  // //   if(!tour)
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
  // #################################################NEW VERSION
  const tour = await Tour.findById(req.params.id);
  // we need to return next to not sent 2 responses
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
exports.createTour = catchAsync(async (req, res, next) => {
  // OLD version
  // express don't add the request body to the request object so we need to use middleware to handle this
  //   console.log(req.body);
  // const newId = tours[tours.length - 1].id + 1;
  // //   req.body -> is already an obj
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tours: newTour
  //       }
  //     });
  //   }
  // );
  // #################################################NEW VERSION
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour
    }
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  // OLD version
  // const tourId = req.params.id * 1;
  // const tour = tours.find(el => el.id === tourId);
  // here error is handles
  //   if(tourId > tours.length)
  // const idexOfTour = tours.findIndex(el => el.id === tourId);
  // // here we will update the tour
  // const udateData = req.body;
  // const updatedObj = { ...tour, ...udateData };
  // tours[idexOfTour] = updatedObj;
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tours: updatedObj
  //       }
  //     });
  //   }
  // );
  // #################################################NEW VERSION
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // will run the schema validators before updating the data
    runValidators: true
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  // OLD version
  // const tourId = req.params.id * 1;
  // const tour = tours.find(el => el.id === tourId);
  // // here error is handles
  // //   if(tourId > tours.length)
  // const idexOfTour = tours.findIndex(el => el.id === tourId);
  // // here we will update the tour
  // tours.splice(idexOfTour, 1);
  // for (let i = 0; i < tours.length; i++) {
  //   tours[i].id = i;
  // }
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {
  //     res.status(204).json({
  //       status: 'success',
  //       data: null
  //     });
  //   }
  // );
  // OLD version  // #################################################NEW VERSION

  const tour = await Tour.findByIdAndDelete(req.params.id);
  // console.log(deletedTour);
  // 204 -> No content
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
// create a function for getting tours statistics
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    // ratingsAverage without $ bcz it will that check the field value
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // but here will use the field value itself
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' }
      }
    },
    { $sort: { avgPrice: 1 } }
    // here we use the defined names in the group -> the fields itself not exist bcz the group will return a document with tha values we calculated
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: stats.length,
    data: {
      stats
    }
  });
});
// create a function for  getting the most busy month in a specific year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    // first unwind the array of startDates
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      // limit the result for 12 months [1:12]
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: plan.length,
    data: {
      plan
    }
  });
});
