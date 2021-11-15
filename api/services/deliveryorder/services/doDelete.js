const {
  DeliveryOrderModel,
} = require('carpinteria-erp-models');

/**
 * Delete invoice
 * @param {Object} params
 * @returns {Promise<*>}
 */
const doDelete = ({ id }) => DeliveryOrderModel.findOneAndDelete({ _id: id });

module.exports = doDelete;
