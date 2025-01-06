const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token
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
  // 3) if everything is ok
  createSendToken(user, 200, res);
});
exports.signup = catchAsync(async (req, res, next) => {
  // we must specify which data we want to assign to the new user from the request body bcz if we don't specify that any one can create a user with any wanted role.& same for other stuff

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  // create token and pass it to the client  after the user signUp to make auto signIn
  createSendToken(newUser, 201, res);
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
//restrict actions on deleting tour
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do NOT have permission to perform this action!', 403)
      );
    }
    next();
  };
};

// forgot and reset password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get the user's email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('this email is not exist!', 404));
  }
  // 2)generate random token -> will make it as instant method on the user schema  -> bcz its related to the user data itself
  const resetToken = user.createPasswordRestToken();
  // save the updates
  await user.save({ validateBeforeSave: false });
  // 3)send it back as email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? submit a patch request with your new password and passwordConfirm to: ${resetURL}.\nIf you did NOT forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordRestToken = undefined;
    user.passwordRestExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get the user by using its token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordRestToken: hashedToken,
    passwordRestExpires: { $gt: Date.now() }
  });
  //2) if the token not expired & the user exist , set the new user
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordRestToken = undefined;
  user.passwordRestExpires = undefined;
  await user.save();
  // 3) update the passwordChangedAt property -> in the pre middleware -> in user model
  // 4)Log the user in , send JWT
  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // Available for logged users only
  // 1- get the user from collection
  //  we didn't use findByIdAndUpdate because it will turn off the validators
  // anything related to password we don't use update
  // +password to add the password to the returned user from the DB bcz we made the password  doesn't return by default in the schema
  const user = await User.findById(req.user.id).select('+password');
  // 2- check if the POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Password is NOT correct!', 401));
  }
  // 3- if so,update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4-log the user in , send JWT
  createSendToken(user, 200, res);
});
