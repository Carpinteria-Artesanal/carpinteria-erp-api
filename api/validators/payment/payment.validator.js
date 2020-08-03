/* eslint-disable camelcase */
const Promise = require('bluebird');
const { PaymentModel } = require('arroyo-erp-models');
const { paymentErrors, commonErrors } = require('../../../errors');
const { TYPE_PAYMENT } = require('../../../constants');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkIdPayment = async id => {
  const paymentExist = await PaymentModel.exists({ _id: id });
  if (!paymentExist) throw new paymentErrors.PaymentIdNotFound();
};
/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ params: { id } }) => _checkIdPayment(id);

/**
 * Check if invalid date
 * @param {number} date
 * @returns {boolean}
 * @private
 */
const _isInvalidDate = date => !date || typeof date !== 'number';

/**
 * Validate params for confirm invoice
 * @param {String} type
 * @param {String} id
 * @returns {Promise<void>}
 */
const confirmParams = async ({ body: { type, paymentDate, numCheque } }) => {
  if (!type) throw new commonErrors.MissingParamsError();
  if (_isInvalidDate(paymentDate)) throw new commonErrors.DateNotValid();
  if (type === TYPE_PAYMENT.CHEQUE && !numCheque) throw new commonErrors.MissingParamsError();
};

/**
 * Comprueba que existen varios pagos
 * @param {Array<String>} payments
 * @returns {Promise<void>}
 */
const havePayments = async ({ payments }) => {
  if (payments?.length < 2) throw new paymentErrors.PaymentsMissing();
  Promise.all(payments.map(_checkIdPayment));
};

module.exports = {
  confirmParams,
  validateId,
  havePayments,
};
