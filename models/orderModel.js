const pool = require('../db');

const Order = {
async createOrder(orderData) {
    let client;
    try {
        const {customer_id, plan_id, status ,name} = orderData;

        // Start a transaction
        client = await pool.connect();
        await client.query('BEGIN');
        // Find the salesperson_id based on seller_name
        const { rows } = await client.query(
            'SELECT salesperson_id FROM salesperson WHERE name = $1',
            [name]
        );

        if (rows.length === 0) {
            throw new Error('Salesperson not found');
        }

        const salesperson_id = rows[0].salesperson_id;

        // Insert order
        const orderQuery = `
            INSERT INTO orders (customer_id, plan_id, status, salesperson_id)
            VALUES ($1, $2, $3,$4)
            RETURNING order_id
        `;
        const { rows: [order] } = await client.query(
            orderQuery,
            [customer_id, plan_id, status || 'Pending',salesperson_id]
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
            [orderId, amount, 'Success']
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
         // Update the status of the order to 'Completed'
         const updateStatusQuery = `
         UPDATE orders
         SET status = 'Completed'
         WHERE order_id = $1
         RETURNING *
     `;
     await client.query(
         updateStatusQuery,
         [orderId]
     );

        // Commit the transaction
        await client.query('COMMIT');
      // Update orderData status
      orderData.status = 'Completed';

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
      const query = `
          SELECT o.order_id, o.customer_id, o.plan_id, o.status, o.transaction_id,
                 p.plan_name, p.amount, p.expected_return
          FROM orders o
          INNER JOIN plans p ON o.plan_id = p.plan_id
          WHERE o.customer_id = $1
      `;
      const { rows } = await pool.query(query, [customerId]);
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
