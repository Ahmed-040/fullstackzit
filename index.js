// app.js

const express = require('express');
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Mount routes
const customersRoutes = require('./routes/customersRoutes');
app.use('/api/customers', customersRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
