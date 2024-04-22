const Customer = require('../models/customers');
const Joi = require('joi');
//For validation purposes:
const customerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).allow('').optional(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    address_line_1: Joi.string().required(),
    address_line_2: Joi.string().allow('').optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    phone_number: Joi.string().pattern(new RegExp('^\\+?[0-9]{6,14}$')).required(),
  });
  
//Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Create a customer
const createCustomer = async (req, res) => {
    try {
      const newCustomer = await Customer.createCustomer(req.body);
      const { error } = customerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }  
      res.json(newCustomer);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

//Get a customer by id
const getCustomerById = async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const customer = await Customer.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

//Update a customer by id
const updateCustomer = async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const updatedCustomer = await Customer.updateCustomer(customerId, req.body);
      const { error } = customerSchema.validate(req.body);
      if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
      res.json(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };  

//Delete a customer
const deleteCustomer = async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const deletedCustomer = await Customer.getCustomerById(customerId); // Check if the customer exists
      if (!deletedCustomer) {
        return res.status(404).json({ error: `Customer with ID ${customerId} not found` });
      }
      await Customer.deleteCustomer(customerId);
      res.json({ message: `Customer with ID ${customerId} has been deleted` }); // Provide a message specifying which customer has been deleted
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
module.exports = { getAllCustomers, createCustomer,getCustomerById,deleteCustomer,updateCustomer};