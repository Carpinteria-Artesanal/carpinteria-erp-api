const { DeliveryOrderModel } = require('carpinteria-erp-models');

/**
 * Get all client invoices
 * @param {String} year
 * @returns {Promise<*>}
 */
const orders = ({
  year,
}) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  return DeliveryOrderModel.find({
    date: {
      $gte: start,
      $lt: end,
    },
  }, '_id nameClient total date nOrder')
    .sort({ date: -1 })
    .lean();
};

module.exports = orders;
