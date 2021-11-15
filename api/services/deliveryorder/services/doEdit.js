const { DeliveryOrderModel } = require('carpinteria-erp-models');

/**
 * Modifica la factura de cliente
 * @param {String} id
 * @param {number} date
 * @param {{total: number, iva: number, taxBase: number}} totals
 * @returns {*}
 */
const clientInvoiceEdit = ({
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
  return DeliveryOrderModel
    .findOneAndUpdate({ _id: id }, newData, { new: true })
    .then(doUpdated => ({
      deliveryOrder: doUpdated,
      date: Boolean(date),
      totals: Boolean(totals),
    }));
};

module.exports = clientInvoiceEdit;
