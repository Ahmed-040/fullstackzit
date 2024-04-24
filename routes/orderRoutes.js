const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orderController');

router.post('/', ordersController.createOrder);
router.get('/', ordersController.getAllOrders);
router.get('/:orderId', ordersController.getOrderById);
router.put('/:orderId', ordersController.updateOrder);
router.delete('/:orderId', ordersController.deleteOrder);
router.get('/customer/:customerId', ordersController.getOrdersByCustomer);

module.exports = router;
