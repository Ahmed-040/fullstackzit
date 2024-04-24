const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// Routes for plans
router.get('/', planController.getAllPlans);
router.get('/:planId', planController.getPlanById);
router.post('/', planController.createPlan);
router.put('/:planId', planController.updatePlan);
router.delete('/:planId', planController.deletePlan);

module.exports = router;
