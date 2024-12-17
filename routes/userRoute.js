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
router.post('/resetPassword', authController.resetPassword);

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
