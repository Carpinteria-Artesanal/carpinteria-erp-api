const { InvoiceModel } = require('carpinteria-erp-models');

/**
 * Devuelve las facturas del cliente
 * @param {Object} filters
 * @returns {Promise<*>}
 */
const invoicePayments = async (filters = {}) => {
  const query = { $or: [{ paid: { $exists: false } }, { paid: false }] };

  const invoices = await InvoiceModel.find(query)
    .sort({ nInvoice: -1 })
    .lean();

  return {
    invoices,
    ...filters,
  };
};
module.exports = invoicePayments;
