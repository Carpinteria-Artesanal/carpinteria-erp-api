const { AutoIncrement } = require('carpinteria-erp-models');

/**
 * Generate new order number for the year
 * @param {Number} date
 * @returns {Promise<number>}
 * @private
 */
const generateNumberBudget = date => {
  const dateInvoice = new Date(date);
  return AutoIncrement.increment(`budget${dateInvoice.getFullYear()}`);
};

module.exports = generateNumberBudget;
