/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlersFactory');
// multer config
// cb(null) => means no errors
// save the uploaded image directly to the file system before perform any image processing
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
// save the uploaded file to the memory so we can make our image processing before saving it to the filesystem
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadUserImage = upload.single('photo');
exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); //no file exist to be processed
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
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
  // console.log(req.file);
  // console.log(req.body);
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
  if (req.file) filteredObj.photo = req.file.filename;
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
