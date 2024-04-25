const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orderController');

router.post('/', ordersController.createOrder);
router.get('/', ordersController.getAllOrders);
router.get('/customers', ordersController.getOrdersByCustomer);
router.get('/:orderId', ordersController.getOrderById);
router.put('/:orderId', ordersController.updateOrder);
router.delete('/:orderId', ordersController.deleteOrder);


module.exports = router;
