const express = require('express');
const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    // check the token
    authController.protect,
    // restrict the access to this route for specific users
    authController.restrictTo('user'),
    reviewsController.createReview
  );
module.exports = router;
