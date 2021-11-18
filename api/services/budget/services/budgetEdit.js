const { BudgetModel } = require('carpinteria-erp-models');

/**
 * Modifica la factura de cliente
 * @param {String} id
 * @param {number} date
 * @param {{total: number, iva: number, taxBase: number}} totals
 * @returns {*}
 */
const budgetEdit = ({
  params: { id },
  body: {
    date,
    totals,
  },
}) => {
  // TODO add payments
  const newData = {
    ...(date && { date }),
    ...(totals && {
      total: totals.total,
      iva: totals.iva,
      taxBase: totals.taxBase,
    }),
  };
  return BudgetModel
    .findOneAndUpdate({ _id: id }, newData, { new: true })
    .then(budgetUpdated => ({
      budget: budgetUpdated,
      date: Boolean(date),
      totals: Boolean(totals),
    }));
};

module.exports = budgetEdit;
