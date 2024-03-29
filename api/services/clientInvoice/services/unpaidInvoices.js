const { ClientInvoiceModel } = require('carpinteria-erp-models');

/**
 * Devuelve las facturas del cliente
 * @param {Object} params
 * @returns {Promise<*>}
 */
const unpaidInvoices = async ({
  offset,
  limit,
  from,
  to,
}) => {
  let date = {};
  if (from || to) {
    date = {
      date: {
        ...(from && { $gte: from }),
        ...(to && { $lt: to }),
      },
    };
  }

  const query = { $or: [{ paid: { $exists: false } }, { paid: false }], ...date };
  const invoices = await ClientInvoiceModel.find(query, '_id nInvoice date total dateInvoice nameClient remaining')
    .sort({ nInvoice: -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit || 0))
    .lean();

  const count = await ClientInvoiceModel.countDocuments(query);

  return {
    invoices,
    count,
  };
};
module.exports = unpaidInvoices;
