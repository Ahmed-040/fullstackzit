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
const createCustomer = async (body) => {
        const { error } = customerSchema.validate(body);
        if (error) {
          return {
            error:error.details[0].message
          }
        }  
      const newCustomer = await Customer.createCustomer(body);
      console.log(newCustomer)
    //   res.json(newCustomer);
    
    // } catch (error) {
    //   console.error('Error creating customer:', error);
    //   res.status(500).json({ error: 'Internal server error',errorcode:'not getting the correct data' });
    // }
  };

//Get a customer by id
const getCustomerById = async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const customer = await Customer.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
    //   res.json(customer);
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
      res.json(customerWithoutPassword);
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

//Update a customer by id
const updateCustomer = async (req, res) => {
    try {
      const customerId = req.params.customerId;
      const { error } = customerSchema.validate(req.body);
      if (error) {
      return res.status(400).json({ error: error.details[0].message , errorCode: 'VALIDATION_ERROR'});
    }
      const updatedCustomer = await Customer.updateCustomer(customerId, req.body);
    //   res.json(updatedCustomer);
    // Exclude hashed password from the response
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
      res.json(customerWithoutPassword);
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

      res.status(201).json('customer created');
  } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

  
// Function to login a customer
const login = async (req, res) => {
  try {
      // Extract username and password from request body
      const { username, password } = req.body;

      // Find the customer by username
      const { rows } = await pool.query('SELECT * FROM customers WHERE username = $1', [username]);
      const customer = rows[0];

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

      // Send token as response
      res.json({ token });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
  
module.exports = { getAllCustomers, createCustomer,getCustomerById,deleteCustomer,updateCustomer,signup,login}; 