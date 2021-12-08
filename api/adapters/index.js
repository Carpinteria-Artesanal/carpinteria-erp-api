const billingAdapter = require('./billing');
const budgetAdapter = require('./budget');
const clientInvoiceAdapter = require('./clientInvoice');
const deliveryOrderAdapter = require('./deliveryorders');
const invoiceAdapter = require('./invoice');
const paymentAdapter = require('./payment');

module.exports = {
  billingAdapter,
  budgetAdapter,
  clientInvoiceAdapter,
  deliveryOrderAdapter,
  invoiceAdapter,
  paymentAdapter,
};
