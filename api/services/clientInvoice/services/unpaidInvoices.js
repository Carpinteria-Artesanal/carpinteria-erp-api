const { ClientInvoiceModel } = require('carpinteria-erp-models');

/**
 * Devuelve las facturas del cliente
 * @param {Object} params
 * @returns {Promise<*>}
 */
const unpaidInvoices = async ({
  client,
  offset,
  limit,
}) => {
  const invoices = await ClientInvoiceModel.find({ paid: { $exists: false } }, '_id nInvoice date total dateInvoice nameClient remaining')
    .sort({ nInvoice: -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit))
    .lean();

  const count = await ClientInvoiceModel.countDocuments({ client });

  return {
    invoices,
    count,
  };
};
module.exports = unpaidInvoices;
