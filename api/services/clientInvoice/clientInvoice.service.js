const { ClientInvoiceModel } = require('carpinteria-erp-models');

// Split services
const invoiceConfirm = require('./services/invoiceConfirm');
const create = require('./services/create');
const invoiceEdit = require('./services/invoiceEdit');
const refresh = require('./services/refresh');
const invoices = require('./services/invoices');
const invoicesShort = require('./services/invoicesShort');
const exportOds = require('./services/export');
const invoiceDelete = require('./services/invoiceDelete');
const unpaidInvoices = require('./services/unpaidInvoices');
const billing = require('./services/billing');
const billingExport = require('./services/billingExport');

const addProduct = require('./services/addProduct');
const editProduct = require('./services/editProduct');
const deleteProduct = require('./services/deleteProduct');

const addPayment = require('./services/addPayment');
const refreshPayments = require('./services/refreshPayments');

/**
 * Get invoice data
 * @param {String} id
 * @returns {Promise<*>}
 */
const invoice = ({ id }) => ClientInvoiceModel.findOne({ _id: id });

module.exports = {
  create,
  invoice,
  invoices,
  invoicesShort,
  invoiceEdit,
  invoiceDelete,
  addProduct,
  editProduct,
  deleteProduct,
  invoiceConfirm,
  refresh,
  exportOds,
  unpaidInvoices,
  addPayment,
  refreshPayments,
  billing,
  billingExport,
};
