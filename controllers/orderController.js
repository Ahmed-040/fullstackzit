const { json } = require('body-parser');
const Order = require('../models/orderModel');
const jwt=require('jsonwebtoken');

// Function to extract token and customer ID from headers
const extractTokenAndCustomerId = (req) => {
  const token = req.headers.authorization;
  if (!token) {
    return { error: 'Token is required in headers' };
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const customer_id = decodedToken.customerId;
    if (!customer_id) {
      return { error: 'Customer ID not found in token' };
    }
    return { token, customer_id };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return { error: 'Invalid token' };
    }
    throw error;
  }
};

const createOrder = async (req, res) => {
  try {
    const { token, customer_id } = extractTokenAndCustomerId(req);
    if (token.error) {
      return res.status(400).json({ error: token.error });
    }

    const { plan_id, status ,name} = req.body;
    console.log(req.body)
    if (!plan_id || !status) {
      return res.status(400).json({ error: 'Plan ID and status are required' });
    }
    const newOrder = await Order.createOrder({ customer_id, plan_id, status ,name});
    return res.json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error', errorcode: 'Please check your input' });
  }
};



const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    console.log(req.params);
    const orderId = req.params.orderId;
    const order = await Order.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Internal server error' });
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
    return res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await Order.deleteOrder(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json({ message: `Order with id ${orderId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getOrdersByCustomer = async (req, res) => {
  try {
    const { token, customer_id } = extractTokenAndCustomerId(req);
    if (token.error) {
      return res.status(400).json({ error: token.error });
    }
    const orders = await Order.getOrdersByCustomer(customer_id);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this customer' });
    }

    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by customer:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
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
