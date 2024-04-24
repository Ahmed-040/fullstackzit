// transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');


router.get('/order/:orderId', transactionController.getTransactionsByOrder);
router.get('/customer/:customerId', transactionController.getTransactionsByCustomer);


module.exports = router;
