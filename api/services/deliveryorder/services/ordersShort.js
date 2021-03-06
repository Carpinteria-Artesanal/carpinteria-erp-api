const { DeliveryOrderModel } = require('carpinteria-erp-models');

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
  const orders = await DeliveryOrderModel.find({ client }, '_id nOrder date total')
    .sort({ nOrder: -1 })
    .skip(Number(offset || 0))
    .limit(Number(limit))
    .lean();

  const count = await DeliveryOrderModel.countDocuments({ client });

  return {
    orders,
    count,
  };
};
module.exports = ordersShort;
