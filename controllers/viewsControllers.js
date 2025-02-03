const Tour = require('./../models/tourModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1- get the tours data
  const tours = await Tour.find();
  // 2- build the template that will hold the data
  // 3- render that template using tours data from step one
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // 1- get the data of the tour -> includes reviews & guides
  const tour = await Tour.findOne({
    slug: req.params.slug
  }).populate({
    path: 'reviews',
    fields: 'rating user review'
  });
  // this if statement made it operational error based on appError class that specified this.isOperational = true;!
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2- build the template
  // 3- fill up the template with the data
  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour
  });
});
exports.getLoginFrom = (req, res) => {
  res.status(200).render('login', {
    title: `Log into your account`
  });
};
exports.getSignupFrom = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up'
  });
};
