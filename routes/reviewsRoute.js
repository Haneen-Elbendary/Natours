const express = require('express');
const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');
const router = express.Router({ mergeParams: true });
// { mergeParams: true } to get access to the before route params -> tourId
router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    // check the token
    authController.protect,
    // restrict the access to this route for specific users
    authController.restrictTo('user'),
    reviewsController.setTourUserID,
    reviewsController.createReview
  );
router
  .route('/:id')
  .get(reviewsController.getReview)
  .patch(reviewsController.updateReview)
  .delete(reviewsController.deleteReview);
module.exports = router;
