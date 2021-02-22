const { DeliveryOrderModel } = require('carpinteria-erp-models');

/**
 * Elimina un albarán
 * @param {String} id
 * @return {Promise<void>}
 */
const deleteDeliveryOrder = ({
  id,
}) => (
  DeliveryOrderModel.deleteOne({ _id: id })
);

module.exports = deleteDeliveryOrder;
