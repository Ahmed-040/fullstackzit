const Transaction = require('../models/transactionModel');

const getTransactionsByOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const transactions = await Transaction.getTransactionsByOrder(orderId);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions by order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getTransactionsByCustomer = async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const transactions = await Transaction.getTransactionsByCustomer(customerId);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions by customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  module.exports = {
    getTransactionsByOrder,
    getTransactionsByCustomer
  };  