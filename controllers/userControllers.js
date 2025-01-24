const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlersFactory');

// utility functions
const filterObj = (obj, ...allowedFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFeilds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
// Route handlers 4 users
exports.getAllUsers = factory.getAll(User);
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: users.length,
//     data: {
//       users
//     }
//   });
// });
// the current user delete his account -> he actually just deactivate it
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1- check if the user sent password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route not for pasword updates! ,try /updateMyPassword route instead.'
      )
    );
  }
  // 2- filter the body from un wanted fields ->ex: prevent changing the role
  const filteredObj = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true
  });
  // 3- update the user document
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.getUser = factory.getOne(User);
// this for admins only -> does Not include updating user's password
exports.updateUser = factory.updateOne(User);
// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'this routes not defined yet stay toned!'
//   });
// };
// delete a user is  for admins only
exports.deleteUser = factory.deleteOne(User);
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this routes not defined user /signup instead!'
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
