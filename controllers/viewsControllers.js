const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Booking = require('./../models/bookingModel');

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
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1 find the bookings that include current user ID
  const bookings = await Booking.find({ user: req.user.id });
  // 2 find the tours that are booked
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  // render the booked tours
  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser
  });
});
exports.getVerifyCodeInput = (req, res) => {
  res.status(200).render('verify', {
    title: 'Verify Your Account'
  });
};
