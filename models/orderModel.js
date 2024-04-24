const pool = require('../db');

const Order = {
//   async createOrder(orderData, customerId) {
//     try {
//       const { plan_id, status } = orderData;

//       // Fetch plan details
//       const { rows: [plan] } = await pool.query(
//         'SELECT * FROM plans WHERE plan_id = $1',
//         [plan_id]
//       );

//       if (!plan) {
//         throw new Error('Plan not found');
//       }

//       // Fetch salesperson ID (e.g., round-robin selection)
//       const { rows: [salesperson] } = await pool.query(
//         'SELECT salesperson_id FROM salesperson  LIMIT 1'
//       );

//       if (!salesperson) { 
//         throw new Error('No available salesperson');
//       }

//       // Insert order
//       const { rows } = await pool.query(
//         'INSERT INTO orders (customer_id, plan_id, status, salesperson_id) VALUES ($1, $2, $3, $4) RETURNING *',
//         [customerId, plan_id, status || 'Pending', salesperson.salesperson_id]
//       );

//       const order = rows[0];

//       // Create a transaction
//       const { rows: [transaction] } = await pool.query(
//         'INSERT INTO transactions (order_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
//         [order.order_id, plan.amount, 'Pending']
//       );

//       return {
//         ...order,
//         transaction
//       };
//     } catch (error) {
//       throw error;
//     }
//   },
async createOrder(orderData) {
    let client;
    try {
        const {customer_id, plan_id, status } = orderData;

        // Start a transaction
        client = await pool.connect();
        await client.query('BEGIN');

        // Insert order
        const orderQuery = `
            INSERT INTO orders (customer_id, plan_id, status, salesperson_id)
            VALUES ($1, $2, $3, (SELECT salesperson_id FROM salesperson LIMIT 1))
            RETURNING order_id
        `;
        const { rows: [order] } = await client.query(
            orderQuery,
            [customer_id, plan_id, status || 'Pending']
        );

        const orderId = order.order_id;

        // Fetch plan details
        const { rows: [plan] } = await client.query(
            'SELECT amount FROM plans WHERE plan_id = $1',
            [plan_id]
        );

        if (!plan) {
            throw new Error('Plan not found');
        }

        const amount = plan.amount;

        // Create a transaction
        const { rows: [transaction] } = await client.query(
            'INSERT INTO transactions (order_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
            [orderId, amount, 'Failed']
        );

        const transactionId = transaction.transaction_id;

        // Update the order with the transaction_id
        const updateOrderQuery = `
            UPDATE orders 
            SET transaction_id = $1
            WHERE order_id = $2
            RETURNING *
        `;
        const { rows: [updatedOrder] } = await client.query(
            updateOrderQuery,
            [transactionId, orderId]
        );

        // Commit the transaction
        await client.query('COMMIT');

        return {
            order_id: orderId,
            transaction_id: transactionId,
            ...orderData
        };
    } catch (error) {
        // Rollback the transaction if an error occurs
        if (client) await client.query('ROLLBACK');
        throw error;
    } finally {
        // Release the client back to the pool
        if (client) client.release();
    }
},

   async getOrdersByCustomer(customerId) {
        try {
            const { rows } = await pool.query('SELECT * FROM orders WHERE customer_id = $1', [customerId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

  async getAllOrders() {
    try {
      const { rows } = await pool.query('SELECT * FROM orders');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getOrderById(orderId) {
    try {
      const { rows } = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateOrder(orderId, status) {
    try {
      const { rows } = await pool.query(
        'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
        [status, orderId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const { rows } = await pool.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [orderId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Order;
