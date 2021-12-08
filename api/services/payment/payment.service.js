/* eslint-disable nonblock-statement-body-position */
const { InvoiceModel } = require('carpinteria-erp-models');
const Promise = require('bluebird');

const LogService = require('../log.service');

const TYPE = 'PaymentService';

const logService = new LogService(TYPE);

const confirm = require('./services/confirm');

// TODO Ordenar conforme sea necesario
/**
 *Devuelve todos los pagos no abonados
 * @returns {*}
 */
const payments = () => InvoiceModel.find({
  $or: [{ paid: { $exists: false } }, { paid: false }],
});

module.exports = {
  payments,
  confirm,
};
