const express = require('express');

const tourControllers = require('./../controllers/toursCotrollers');

const router = express.Router();
// create  a param middleware ->it's a middleware  that only run for a specific param in the url
// router.param('id', tourControllers.checkID);
// create a route for the top 5 cheap tours
router
  .route('/top-5-cheap')
  .get(tourControllers.alisTopTours, tourControllers.getAllTours);
router.route('/tours-stats').get(tourControllers.getTourStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);
module.exports = router;
