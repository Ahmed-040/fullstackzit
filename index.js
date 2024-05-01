// app.js

const express = require('express');
const app = express();
const cors=require('cors');
const bodyParser = require('body-parser')

// Mount routes
const customersRoutes = require('./routes/customersRoutes');
const planRoutes = require('./routes/planRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes=require('./routes/transactionRoutes');
const salespersonRoutes=require('./routes/salespersonRoutes');

//MiddleWares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api/transactions',transactionRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/sales',salespersonRoutes);
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
