const express = require('express');

const router = express.Router();

const viewsControllers = require('./../controllers/viewsControllers');
// it was just for test
const authControllers = require('.././controllers/authController');

const bookingController = require('./../controllers/bookingController');

router.get('/me', authControllers.protect, viewsControllers.getAccount);
router.get('/my-tours', authControllers.protect, viewsControllers.getMyTours);
router.post(
  '/update-user-data',
  authControllers.protect,
  viewsControllers.updateUserData
);
// router.use(authControllers.isLoggedIn);
router.get(
  '/',
  bookingController.createBookingCheckout,
  authControllers.isLoggedIn,
  viewsControllers.getOverview
);
// router.get('/tour/:slug', authControllers.protect, viewsControllers.getTour);
router.get('/tour/:slug', authControllers.isLoggedIn, viewsControllers.getTour);
router.get('/login', authControllers.isLoggedIn, viewsControllers.getLoginFrom);
router.get(
  '/signup',
  authControllers.isLoggedIn,
  viewsControllers.getSignupFrom
);
router.get('/verify-email-code', viewsControllers.getVerifyCodeInput);
module.exports = router;
