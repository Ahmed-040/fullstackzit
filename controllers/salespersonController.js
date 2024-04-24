const Salesperson = require('../models/salespersonModel');

const getAllSalespersons = async (req, res) => {
  try {
    const salespersons = await Salesperson.getAllSalespersons();
    res.json(salespersons);
  } catch (error) {
    console.error('Error fetching salespersons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSalespersonById = async (req, res) => {
  try {
    const salespersonId = req.params.id;
    const salesperson = await Salesperson.getSalespersonById(salespersonId);
    if (!salesperson) {
      return res.status(404).json({ error: 'Salesperson not found' });
    }
    res.json(salesperson);
  } catch (error) {
    console.error('Error fetching salesperson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllSalespersons,
  getSalespersonById
};
