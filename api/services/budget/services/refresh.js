const { BudgetModel } = require('carpinteria-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Actualiza el albaran
 * @param {Object} budget
 * @returns {Promise<{budget}|*>}
 */
const refresh = budget => {
  const totals = budget.products.reduce(
    ({
      total,
      taxBase,
    }, current) => ({
      total: total + current.total,
      taxBase: taxBase + current.taxBase,
    }),
    {
      taxBase: 0,
      total: 0,
    },
  );

  const taxBase = roundNumber(totals.taxBase);
  const total = roundNumber(totals.total);
  const iva = roundNumber(total - taxBase);
  return BudgetModel.findOneAndUpdate({ _id: budget._id }, {
    total,
    iva,
    taxBase,
  }, { new: true });
};

module.exports = refresh;
