const { InvoiceModel } = require('carpinteria-erp-models');

// Split services
const invoiceConfirm = require('./services/invoiceConfirm');
const invoiceEdit = require('./services/invoiceEdit');
const refresh = require('./services/refresh');
const invoices = require('./services/invoices');
const invoicesShort = require('./services/invoicesShort');
const expenseCreate = require('./services/expenseCreate');
const exportOds = require('./services/export');
const invoiceDelete = require('./services/invoiceDelete');
const confirmInvoice = require('./services/confirmInvoice');
const payments = require('./services/payments');
/**
 * Get invoice data
 * @param {String} id
 * @returns {Promise<*>}
 */
const invoice = ({ id }) => InvoiceModel.findOne({ _id: id });

module.exports = {
  invoice,
  invoices,
  invoicesShort,
  invoiceConfirm,
  invoiceEdit,
  refresh,
  expenseCreate,
  exportOds,
  invoiceDelete,
  payments,
  confirmInvoice,
};
