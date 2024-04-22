// routes/customersRoutes.js

const express = require('express');
const router = express.Router();
const { getAllCustomers } = require('../controllers/customersController');
const { createCustomer } = require('../controllers/customersController');
const { getCustomerById } = require('../controllers/customersController');
const { deleteCustomer } = require('../controllers/customersController');
const { updateCustomer } = require('../controllers/customersController');

// GET all customers
router.get('/', getAllCustomers);

// POST /api/customers
router.post('/', createCustomer);

// PUT /api/customers/:customerId
router.put('/:customerId', updateCustomer);

// GET /api/customers/:customerId
router.get('/:customerId', getCustomerById);

// DELETE /api/customers/:customerId
router.delete('/:customerId', deleteCustomer);

module.exports = router;
