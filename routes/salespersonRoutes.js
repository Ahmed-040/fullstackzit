const express = require('express');
const router = express.Router();
const salespersonController = require('../controllers/salespersonController');

router.get('/', salespersonController.getAllSalespersons);
router.get('/:id', salespersonController.getSalespersonById);

module.exports = router;
