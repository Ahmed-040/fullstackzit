const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');


router.get('/', customersController.getAllCustomers);
router.post('/', customersController.createCustomer);
router.post('/signup', customersController.signup);
router.post('/login', customersController.login);
router.put('/:customerId', customersController.updateCustomer);
router.get('/:customerId', customersController.getCustomerById);
router.delete('/:customerId', customersController.deleteCustomer);

module.exports = router;
