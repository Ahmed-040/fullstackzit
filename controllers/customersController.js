const Customer = require('../models/customers');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { response } = require('express');
require('dotenv').config();
//For validation purposes:
const customerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .allow('')
    .required()
    .messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least {{#limit}} characters long',
      'string.max': 'Username cannot exceed {{#limit}} characters',
      'any.required': 'Username is required'
    }),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .allow('')
    .required()
    .messages({
      'string.pattern.base': 'Password must contain only letters and numbers',
      'any.required': 'Password is required'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  name: Joi.string()
    .required()
    .pattern(new RegExp('^[a-zA-Z]+$'))
    .allow('')
    .messages({
      'string.pattern.base': 'Name must contain only letters',
      'any.required': 'Name is required'
    }),
  address_line_1: Joi.string()
    .required()
    .allow('')
    .messages({
      'any.required': 'Address Line 1 is required'
    }),
  address_line_2: Joi.string()
    .allow('')
    .optional()
    .messages({
      'any.required': 'Address Line 2 is required'
    }),
  city: Joi.string()
    .required()
    .pattern(new RegExp('^[a-zA-Z]+$'))
    .messages({
      'string.pattern.base': 'City must contain only letters',
      'any.required': 'City is required'
    }),
  state: Joi.string()
    .required()
    .pattern(new RegExp('^[a-zA-Z]+$'))
    .messages({
      'string.pattern.base': 'State must contain only letters',
      'any.required': 'State is required'
    }),
  country: Joi.string()
    .required()
    .pattern(new RegExp('^[a-zA-Z]+$'))
    .messages({
      'string.pattern.base': 'Country must contain only letters',
      'any.required': 'Country is required'
    }),
  phone_number: Joi.string()
    .pattern(new RegExp('^\\+?[0-9]{6,14}$'))
    .required()
    .messages({
      'string.pattern.base': 'Phone Number must be a valid phone number',
      'any.required': 'Phone Number is required'
    }),
});
  
//Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    return res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//Create a customer
const createCustomer = async (body) => {
      const newCustomer = await Customer.createCustomer(body);
      return newCustomer;
  };
//Get a customer by id
const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customer = await Customer.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const customerWithoutPassword = {
      customer_id: customer.customer_id,
      username: customer.username,
      email: customer.email,
      name: customer.name,
      address_line_1: customer.address_line_1,
      address_line_2: customer.address_line_2,
      city: customer.city,
      state: customer.state,
      country: customer.country,
      phone_number: customer.phone_number,
      created_at: customer.created_at,
      updated_at: customer.updated_at
    };
    return res.json(customerWithoutPassword);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//Update a customer by id
const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { error } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    }
    const updatedCustomer = await Customer.updateCustomer(customerId, req.body);
    const customerWithoutPassword = {
      customer_id: updatedCustomer.customer_id,
      username: updatedCustomer.username,
      email: updatedCustomer.email,
      name: updatedCustomer.name,
      address_line_1: updatedCustomer.address_line_1,
      address_line_2: updatedCustomer.address_line_2,
      city: updatedCustomer.city,
      state: updatedCustomer.state,
      country: updatedCustomer.country,
      phone_number: updatedCustomer.phone_number,
      created_at: updatedCustomer.created_at,
      updated_at: updatedCustomer.updated_at
    };
    return res.json(customerWithoutPassword);
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.status(500).json({ error: 'Internal server error' });
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
    return res.json({ message: `Customer with ID ${customerId} has been deleted` }); // Provide a message specifying which customer has been deleted
  } catch (error) {
    console.error('Error deleting customer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

 
//Signup
const signup = async (req, res) => {

  try {
    // Validate input
    const { error } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Create the customer
    const newCustomer = await createCustomer(req.body);
    if (newCustomer.error) {
      return res.status(400).json({ error: newCustomer.error });
    }

    return res.status(201).json({
      resp_code: "200",
      resp_status: "success",
      response: {
        message: "user successfull created",

      }
    });
  } catch (error) {
    console.error('Error signing up:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

  
// Function to login a customer
const login = async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;
    const customer = await Customer.getCustomerByUsername(username);

    // If customer does not exist
    if (!customer) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign({ customerId: customer.customer_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllCustomers, createCustomer,getCustomerById,deleteCustomer,updateCustomer,signup,login}; 