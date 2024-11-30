const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
// Rout handlers 4 users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users
    }
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this routes not defined yet stay toned!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this routes not defined yet stay toned!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this routes not defined yet stay toned!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this routes not defined yet stay toned!'
  });
};
