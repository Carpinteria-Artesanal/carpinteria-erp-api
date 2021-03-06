const {
  ClientInvoiceModel,
} = require('carpinteria-erp-models');

/**
 * Delete invoice
 * @param {Object} params
 * @returns {Promise<*>}
 */
const doDelete = ({ id }) => ClientInvoiceModel.findOneAndDelete({ _id: id });

module.exports = doDelete;
