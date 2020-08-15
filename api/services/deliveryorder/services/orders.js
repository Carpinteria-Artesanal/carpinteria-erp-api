const { DeliveryOrderModel } = require('arroyo-erp-models');

/**
 * Devuelve los albaranes no incluidos en una factura
 * @param {String} provider
 * @returns {Array}
 * @private
 */
const _getFree = ({ provider }) => DeliveryOrderModel.find({
  provider,
  invoice: { $exists: false },
});

/**
 * Devulve los albaranes incluidos en una factura
 * @param {String} provider
 * @param {String} offset
 * @param {String} limit
 * @returns {Array}
 * @private
 */
const _getInInvoices = ({ provider, offset, limit }) => (
  DeliveryOrderModel.find({
    provider,
    invoice: { $exists: true },
  })
    .skip(parseInt(offset, 10))
    .limit(parseInt(limit, 10))
);

/**
 * Devuelve el número de albaren incluidos en facturas
 * @param {String} provider
 * @returns {Number}
 * @private
 */
const _countInInvoices = ({ provider }) => (
  DeliveryOrderModel.find({
    provider,
    nOrder: { $exists: true },
  })
    .countDocuments()
);

/**
 * Return all delivery orders
 * @return {Promise<{free: Array, inInvoice: Array, inInvoiceCount: Number}>}
 */
const orders = async data => ({
  free: await _getFree(data),
  inInvoices: await _getInInvoices(data),
  inInvoiceCount: await _countInInvoices(data),
});

module.exports = orders;
