const { BudgetModel } = require('carpinteria-erp-models');

// Split services
const budgetConfirm = require('./services/budgetConfirm');
const create = require('./services/create');
const budgetEdit = require('./services/budgetEdit');
const refresh = require('./services/refresh');
const orders = require('./services/orders');
const ordersShort = require('./services/ordersShort');
const exportOds = require('./services/export');
const budgetDelete = require('./services/budgetDelete');

const addProduct = require('./services/addProduct');
const editProduct = require('./services/editProduct');
const deleteProduct = require('./services/deleteProduct');

/**
 * Get invoice data
 * @param {String} id
 * @returns {Promise<*>}
 */
const budget = ({ id }) => BudgetModel.findOne({ _id: id });

module.exports = {
  create,
  budget,
  orders,
  ordersShort,
  budgetEdit,
  budgetDelete,
  addProduct,
  editProduct,
  deleteProduct,
  budgetConfirm,
  refresh,
  exportOds,
};
