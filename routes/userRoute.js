const express = require('express');
const userControllers = require('./../controllers/userControllers');
const authController = require('./../controllers/authController');

const router = express.Router();
// a special endpoint for users resource -> don't fit REST philosophy -> it's all about user here
router.post('/signup', authController.signup);
router.post('/login', authController.login);
// recieve user's email only
router.post('/forgotPassword', authController.forgotPassword);
// recieve resetToken & the newPassword
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  //  authController.protect check the token and add the user obj to the req
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userControllers.updateMe);
router.delete('/deleteMe', authController.protect, userControllers.deleteMe);
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
// for system administration too -> admin
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);
module.exports = router;
