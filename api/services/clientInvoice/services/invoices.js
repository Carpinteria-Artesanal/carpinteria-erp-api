const { ClientInvoiceModel } = require('carpinteria-erp-models');

/**
 * Get all client invoices
 * @param {String} year
 * @param {Number} from
 * @param {Number} to
 * @returns {Promise<*>}
 */
const invoices = ({
  year,
  from,
  to,
  offset,
  limit,
  total,
  nInvoice,
}) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return ClientInvoiceModel.find({
    date: {
      $gte: from || start,
      $lt: to || end,
    },
    ...(total && { total: Number(total) }),
    ...(nInvoice && { nInvoice: { $regex: nInvoice } }),
  }, '_id nameClient total date nInvoice payment.paid')
    .sort({ date: -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit || 100))
    .lean();
};

module.exports = invoices;
