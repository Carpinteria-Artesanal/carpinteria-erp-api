/**
 * Devuelve los totales del albarán
 * @param deliveryOrder
 * @returns {{total: *, re: *, iva: *, taxBase: *}}
 */
const totalsResponse = deliveryOrder => ({
  taxBase: deliveryOrder.taxBase,
  iva: deliveryOrder.iva,
  total: deliveryOrder.total,
});

/**
 * Return data or/and totals of the invoice
 * @param {Object} invoice
 * @param {Boolean} data
 * @param {Boolean} totals
 * @returns {{}}
 */
const conditionalDataTotalsResponse = ({
  deliveryOrder,
  date,
  totals,
}) => ({
  ...(date && { date: deliveryOrder.date }),
  ...(totals && { totals: totalsResponse(deliveryOrder) }),
});

module.exports = {
  conditionalDataTotalsResponse,
};
