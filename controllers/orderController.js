const { json } = require('body-parser');
const Order = require('../models/orderModel');
const jwt=require('jsonwebtoken');
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
      //Modifying this api since I will be sending token from the frontend to extract the customer_id
      // const { customer_id, plan_id, status } = req.body; // Extract customer_id, plan_id, status from req.body
      const{token,plan_id,status}=req.body;
      if (!token || !plan_id || !status) {
        return res.status(400).json({ error: 'Token, plan_id, and status are required' });
    }
   const tokenone = JSON.parse(token).token
      const decodedToken=jwt.verify(tokenone,process.env.JWT_SECRET);
      const customer_id=decodedToken.customerId;
      // Check if customer_id, plan_id, and status are provided
      if (!customer_id || !plan_id || !status) {
        return res.status(400).json({ error: 'customer_id, plan_id, and status are required' });
      }
      console.log(customer_id);

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
    console.log(req.params);
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
      // Extract token from request headers
      const token = req.headers.authorization;
      console.log(token);
      if (!token) {
          return res.status(400).json({ error: 'Token is required' });
      }
      const tokenone = JSON.parse(token).token
      // Decode token to get customer_id
      const decodedToken = jwt.verify(tokenone, process.env.JWT_SECRET);
      const customer_id = decodedToken.customerId;
      console.log(customer_id);

      if (!customer_id) {
          return res.status(400).json({ error: 'Customer ID not found in token' });
      }

      const orders = await Order.getOrdersByCustomer(customer_id);
      if (!orders || orders.length === 0) {
          return res.status(404).json({ error: 'No orders found for this customer' });
      }

      res.json(orders);
  } catch (error) {
      console.error('Error fetching orders by customer:', error);
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Invalid token' });
      }
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
