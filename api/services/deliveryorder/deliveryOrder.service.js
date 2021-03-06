const { DeliveryOrderModel } = require('carpinteria-erp-models');

// Split services
const doConfirm = require('./services/doConfirm');
const create = require('./services/create');
const doEdit = require('./services/doEdit');
const refresh = require('./services/refresh');
const orders = require('./services/orders');
const ordersShort = require('./services/ordersShort');
const exportOds = require('./services/export');
const doDelete = require('./services/doDelete');

const addProduct = require('./services/addProduct');
const editProduct = require('./services/editProduct');
const deleteProduct = require('./services/deleteProduct');

/**
 * Get invoice data
 * @param {String} id
 * @returns {Promise<*>}
 */
const deliveryOrder = ({ id }) => DeliveryOrderModel.findOne({ _id: id });

module.exports = {
  create,
  deliveryOrder,
  orders,
  ordersShort,
  doEdit,
  doDelete,
  addProduct,
  editProduct,
  deleteProduct,
  doConfirm,
  refresh,
  exportOds,
};
