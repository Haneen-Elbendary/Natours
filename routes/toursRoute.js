const express = require('express');

const tourControllers = require('./../controllers/toursCotrollers');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewsRoute');
const router = express.Router();
// create  a param middleware ->it's a middleware  that only run for a specific param in the url
// router.param('id', tourControllers.checkID);
// create a route for the top 5 cheap tours
// ----------------->
// POST tours/tour_id/reviews
// GET tours/tour_id/reviews
// GET tours/tour_id/reviews/review_id
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),reviewController.createReview
//   );
// instead of the messy nested route above -> we will redirect from the tour route to the review route if this route -> /:tourId/reviews hit the tour router
router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top-5-cheap')
  .get(tourControllers.alisTopTours, tourControllers.getAllTours);
router.route('/tours-stats').get(tourControllers.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan
  );
router
  .route('/')
  // allow any one to get all tours
  .get(tourControllers.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour
  );
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

module.exports = router;
