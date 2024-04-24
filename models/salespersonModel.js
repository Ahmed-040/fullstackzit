const pool = require('../db');

const Salesperson = {
  async getAllSalespersons() {
    try {
      const { rows } = await pool.query('SELECT * FROM salesperson');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getSalespersonById(salespersonId) {
    try {
      const { rows } = await pool.query('SELECT * FROM salesperson WHERE salesperson_id = $1', [salespersonId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Salesperson;
