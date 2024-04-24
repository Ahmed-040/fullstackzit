const Order = require('../models/orderModel');

// const createOrder = async (req, res) => {
//   try {
//     const customerId = req.body; 
//     const newOrder = await Order.createOrder(req.body, customerId);
//     res.json(newOrder);
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
const createOrder = async (req, res) => {
    try {
      const { customer_id, plan_id, status } = req.body; // Extract customer_id, plan_id, status from req.body
  
      // Check if customer_id, plan_id, and status are provided
      if (!customer_id || !plan_id || !status) {
        return res.status(400).json({ error: 'customer_id, plan_id, and status are required' });
      }
  
      const newOrder = await Order.createOrder({ customer_id, plan_id, status }); // Pass an object with extracted properties
      res.json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal server error',errorcode:'Please check your input' });
    }
  };
  

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const status = req.body.status;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedOrder = await Order.updateOrder(orderId, status);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await Order.deleteOrder(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: `Order with id ${orderId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getOrdersByCustomer = async (req, res) => {
    try {
      const customerId = req.params.customerId;
      if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' });
      }
      
      const orders = await Order.getOrdersByCustomer(customerId);
      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: 'No orders found for this customer' });
      }
  
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders by customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer
};
