// Import the plan model
const Plan = require('../models/planModel');
//For validation purpose
const Joi = require('joi');

const planSchema = Joi.object({
    plan_name: Joi.string().required(),
    plan_desc: Joi.string().required(),
    plan_term: Joi.number().integer().positive().required(),
    amount: Joi.number().precision(2).positive().required(),
    expected_return: Joi.number().precision(2).positive().required()
});

const planController = {
    // Get all plans
    async getAllPlans(req, res) {
        try {
            const plans = await Plan.getAllPlans();
            return res.json(plans);
        } catch (error) {
            console.error('Error fetching plans:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get plan by ID
    async getPlanById(req, res) {
        try {
            const planId = req.params.planId;
            const plan = await Plan.getPlanById(planId);
            if (!plan) {
                return res.status(404).json({ error: 'Plan not found' });
            }
            return res.json(plan);
        } catch (error) {
            console.error('Error fetching plan:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Create a new plan
    async createPlan(req, res) {
        try {
            const { error } = planSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
            }
            const newPlan = await Plan.createPlan(req.body);
            return res.status(201).json(newPlan);
        } catch (error) {
            console.error('Error creating plan:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update plan by ID
    async updatePlan(req, res) {
        try {
            const planId = req.params.planId;
            const { error } = planSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
            }
            const updatedPlan = await Plan.updatePlan(planId, req.body);
            if (!updatedPlan) {
                return res.status(404).json({ error: 'Plan not found' });
            }
            res.json(updatedPlan);
        } catch (error) {
            console.error('Error updating plan:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    // Delete plan by ID
    async deletePlan(req, res) {
        try {
            const planId = req.params.planId;
            const deletedCount = await Plan.deletePlan(planId);
            if (deletedCount === 0) {
                return res.status(404).json({ error: 'Plan not found' });
            }
            return res.json({ message: `Plan with ID ${planId} deleted successfully` });
        } catch (error) {
            console.error('Error deleting plan:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = planController;
