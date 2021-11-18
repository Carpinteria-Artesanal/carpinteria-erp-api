/**
 * Devuelve los totales del albarán
 * @param budget
 * @returns {{total: *, re: *, iva: *, taxBase: *}}
 */
const totalsResponse = budget => ({
  taxBase: budget.taxBase,
  iva: budget.iva,
  total: budget.total,
});

/**
 * Return data or/and totals of the invoice
 * @param {Object} invoice
 * @param {Boolean} data
 * @param {Boolean} totals
 * @returns {{}}
 */
const conditionalDataTotalsResponse = ({
  budget,
  date,
  totals,
}) => ({
  ...(date && { date: budget.date }),
  ...(totals && { totals: totalsResponse(budget) }),
});

module.exports = {
  conditionalDataTotalsResponse,
};
