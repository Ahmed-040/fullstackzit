const pool = require('../db');

const Transaction = {
  async getTransactionsByOrder(orderId) {
    try {
      const { rows } = await pool.query('SELECT * FROM transactions WHERE order_id = $1', [orderId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getTransactionsByCustomer(customerId) {
    try {
      const query = `
            SELECT * 
            FROM transactions 
            WHERE order_id IN (
              SELECT order_id 
              FROM orders 
              WHERE customer_id = $1
            )
          `;
      const { rows } = await pool.query(query, [customerId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Transaction;