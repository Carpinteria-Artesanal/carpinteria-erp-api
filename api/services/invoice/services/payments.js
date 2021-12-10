const { InvoiceModel } = require('carpinteria-erp-models');

/**
 * Devuelve las facturas del cliente
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoicePayments = ({
  from,
  to,
}) => {
  let date = {};
  if (from || to) {
    date = {
      dateInvoice: {
        ...(from && { $gte: from }),
        ...(to && { $lt: to }),
      },
    };
  }

  const query = { $or: [{ paid: { $exists: false } }, { paid: false }], ...date };

  return InvoiceModel.find(query)
    .sort({ nInvoice: -1 })
    .lean();
};
module.exports = invoicePayments;
