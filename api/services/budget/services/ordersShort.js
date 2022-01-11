const { BudgetModel } = require('carpinteria-erp-models');

/**
 * Devuelve las facturas del cliente
 * @param {Object} params
 * @returns {Promise<*>}
 */
const ordersShort = async ({
  client,
  offset,
  limit,
}) => {
  let orders = await BudgetModel.find({
    client,
    nInvoice: { $exists: true },
  }, '_id nInvoice date total')
    .sort({ nInvoice: -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit))
    .lean();

  const ordersInProgress = await BudgetModel.find({
    client,
    nInvoice: { $exists: false },
  }, '_id nInvoice date total')
    .lean();

  orders = [
    ...ordersInProgress,
    ...orders,
  ];
  const count = await BudgetModel.countDocuments({ client, nInvoice: { $exists: true } });

  return {
    orders,
    count,
  };
};
module.exports = ordersShort;
