const express = require('express');

const router = express.Router();

const viewsControllers = require('./../controllers/viewsControllers');
// it was just for test
const authControllers = require('.././controllers/authController');

router.get('/me', authControllers.protect, viewsControllers.getAccount);
router.post(
  '/update-user-data',
  authControllers.protect,
  viewsControllers.updateUserData
);
router.use(authControllers.isLoggedIn);
router.get('/', viewsControllers.getOverview);
// router.get('/tour/:slug', authControllers.protect, viewsControllers.getTour);
router.get('/tour/:slug', viewsControllers.getTour);
router.get('/login', viewsControllers.getLoginFrom);
router.get('/signup', viewsControllers.getSignupFrom);

module.exports = router;
