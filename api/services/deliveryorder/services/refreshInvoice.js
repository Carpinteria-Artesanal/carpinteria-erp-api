const { DeliveryOrderModel } = require('carpinteria-erp-models');

/**
 * Refresh delivery order and remove invoice assigned
 * @param {Object} invoice
 */
const refreshInvoice = invoice => DeliveryOrderModel.updateMany(
  { invoice: invoice._id },
  {
    $unset: {
      invoice: '',
      nOrder: '',
    },
  },
);

module.exports = refreshInvoice;
