const express = require('express');

const router = express.Router();

const viewsControllers = require('./../controllers/viewsControllers');

router.get('/', viewsControllers.getOverview);
router.get('/tour/:slug', viewsControllers.getTour);
router.get('/login', viewsControllers.getLoginFrom);
router.get('/signup', viewsControllers.getSignupFrom);
module.exports = router;
