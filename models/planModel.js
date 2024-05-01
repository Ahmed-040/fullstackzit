// Import the database pool
const pool = require('../db');

const Plan = {
    // Function to get all plans
    async getAllPlans() {
        try {
            const { rows } = await pool.query('SELECT * FROM plans');
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Function to get plan by ID
    async getPlanById(planId) {
        try {
            const { rows } = await pool.query('SELECT * FROM plans WHERE plan_id = $1', [planId]);
            if (rows.length === 0) {
                return null; // Plan not found
            }
            return rows[0]; // Return the plan data
        } catch (error) {
            throw error;
        }
    },

    // Function to create a new plan
    async createPlan(planData) {
        try {
            const { plan_name, plan_desc, plan_term, amount, expected_return } = planData;
            const { rows } = await pool.query('INSERT INTO plans (plan_name, plan_desc, plan_term, amount, expected_return) VALUES ($1, $2, $3, $4, $5) RETURNING *', [plan_name, plan_desc, plan_term, amount, expected_return]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Function to update plan by ID
    async updatePlan(planId, newData) {
        try {
            const { plan_name, plan_desc, plan_term, amount, expected_return } = newData;
            const updateQuery = 'UPDATE plans SET plan_name = $1, plan_desc = $2, plan_term = $3, amount = $4, expected_return = $5 WHERE plan_id = $6 RETURNING *';
            const { rows } = await pool.query(updateQuery, [plan_name, plan_desc, plan_term, amount, expected_return, planId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },


    // Function to delete plan by ID
    async deletePlan(planId) {
        try {
            const { rowCount } = await pool.query('DELETE FROM plans WHERE plan_id = $1', [planId]);
            return rowCount;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Plan;
