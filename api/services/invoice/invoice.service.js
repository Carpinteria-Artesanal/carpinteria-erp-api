const { InvoiceModel } = require('arroyo-erp-models');
const {
  InvoiceMissingDeliveryOrders,
} = require('../../../errors/invoice.errors');
const { calcNewShopping, addInvoiceToDeliveryOrder } = require('./utils');

/**
 * Create invoice
 * @param {Object} data
 */
const create = async data => {
  let invoice = {};
  if (data.deliveryOrders) {
    if (!data.deliveryOrders.length) throw new InvoiceMissingDeliveryOrders();
    invoice = await calcNewShopping(data);
  }

  const newInvoice = await new InvoiceModel(invoice).save();

  if (data.deliveryOrders) await addInvoiceToDeliveryOrder(newInvoice, invoice.deliveryOrders);

  return newInvoice;
};

/**
 *
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoices = async ({ offset, limit }) => await InvoiceModel.find({}, '_id nameProvider nOrder dateInvoice total')
  .sort({ nOrder: -1 })
  .skip(offset || 0)
  .limit(limit)
  .lean();

/**
 * Devuelve las facturas del proveedor
 * @param {Object} params
 * @returns {Promise<*>}
 */
const invoicesByProvider = async ({
  concept, provider, offset, limit,
}) => {
  const filter = {
    ...(concept && { concept }),
    ...(provider && { provider }),
  };

  return await InvoiceModel.find(filter, '_id nOrder dateInvoice total')
    .sort({ nOrder: -1 })
    .skip(offset || 0)
    .limit(limit)
    .lean();
};

module.exports = {
  create,
  invoices,
  invoicesByProvider,
};
