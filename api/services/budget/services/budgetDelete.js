const {
  BudgetModel,
} = require('carpinteria-erp-models');

/**
 * Delete invoice
 * @param {Object} params
 * @returns {Promise<*>}
 */
const budgetDelete = ({ id }) => BudgetModel.findOneAndDelete({ _id: id });

module.exports = budgetDelete;
