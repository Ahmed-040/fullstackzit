const pool = require('../db');
const bcrypt = require('bcrypt');
//Get all customers
const getAllCustomers = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM customers');
    return rows;
  } catch (error) {
    throw error;
  }
};

//Create a customer
const createCustomer = async (customerData) => {
    try {
      const hashedPassword = await bcrypt.hash(customerData.password, 10); // Hash the password
      const { rows } = await pool.query('INSERT INTO customers (username, password, email, name, address_line_1, address_line_2, city, state, country, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [
        customerData.username,
        hashedPassword, // Store the hashed password
        customerData.email,
        customerData.name,
        customerData.address_line_1,
        customerData.address_line_2,
        customerData.city,
        customerData.state,
        customerData.country,
        customerData.phone_number
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  };

 //Update a customer
 const updateCustomer = async (customerId, customerData) => {
    try {
      const hashedPassword = await bcrypt.hash(customerData.password, 10); // Hash the password
      const { rows } = await pool.query('UPDATE customers SET username = $1, password = $2, email = $3, name = $4, address_line_1 = $5, address_line_2 = $6, city = $7, state = $8, country = $9, phone_number = $10, updated_at = CURRENT_TIMESTAMP WHERE customer_id = $11 RETURNING *', [
        customerData.username,
        hashedPassword, // Store the hashed password
        customerData.email,
        customerData.name,
        customerData.address_line_1,
        customerData.address_line_2,
        customerData.city,
        customerData.state,
        customerData.country,
        customerData.phone_number,
        customerId
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  };

//Get a customer by ID
const getCustomerById = async (customerId) => {
    try {
      const { rows } = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [customerId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  };

//Delete a customer by ID
const deleteCustomer = async (customerId) => {
    try {
      await pool.query('DELETE FROM customers WHERE customer_id = $1', [customerId]);
    } catch (error) {
      throw error;
    }
  };  
  

module.exports = { getAllCustomers ,createCustomer, updateCustomer, getCustomerById ,deleteCustomer};   