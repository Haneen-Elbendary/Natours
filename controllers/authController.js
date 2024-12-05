const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email && password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400)); //400 -> bad request
  }
  // 2) check the user exist && password
  // it's a query so we need to await it
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); //400 -> unauthorized
  }
  const token = signToken(user._id);
  // 3) if everything is ok
  res.status(200).json({
    status: 'success',
    token
  });
});
exports.signup = catchAsync(async (req, res, next) => {
  // we must specify which data we want to assign to the new user from the request body bcz if we don't specify that any one can create a user with any wanted role.& same for other stuff

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });
  // create token and pass it to the client  after the user signUp to make auto signIn
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    user: newUser
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1)check if there's a token & get it if it's exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2)verify the token -> check if the payload changed 'token is valid?' -> check if the token is expired
  // the resolved value of that promise will return decoded data from the payload JWT
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3)check if the user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // 4)check if the user changed the password
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE!
  req.user = currentUser;
  next();
});
