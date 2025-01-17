const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlersFactory');
exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews
//     }
//   });
// });
// exports.createReview = catchAsync(async (req, res, next) => {
//   // allow nested route -> ensure the body of the request holds the logged user ID && the current tour ID
//   if (!req.body.tour) req.body.tour = req.params.tourId; //from query string
//   if (!req.body.user) req.body.user = req.user.id; //the user added on the req from protect middleware
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview
//     }
//   });
// });
exports.setTourUserID = (req, res, next) => {
  // allow nested route -> ensure the body of the request holds the logged user ID && the current tour ID
  if (!req.body.tour) req.body.tour = req.params.tourId; //from query string
  if (!req.body.user) req.body.user = req.user.id; //the user added on the req from protect middleware
  next();
};
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
