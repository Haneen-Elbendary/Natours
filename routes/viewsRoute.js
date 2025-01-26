const express = require('express');

const router = express.Router();

const viewsControllers = require('./../controllers/viewsControllers');

router.get('/', viewsControllers.getOverview);
router.get('/tour', viewsControllers.getTour);
module.exports = router;
