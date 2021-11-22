/* eslint-disable camelcase, nonblock-statement-body-position */
const {
  ClientInvoiceModel,
  AutoIncrement,
} = require('carpinteria-erp-models');
const {
  invoiceErrors,
  commonErrors,
} = require('../../../errors');
const { isNumber } = require('../../../utils');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const invoiceExist = await ClientInvoiceModel.exists({ _id: id });
  if (!invoiceExist) throw new invoiceErrors.InvoiceIdNotFound();
};
/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);

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
const isValidForConfirmed = async ({
  id,
}) => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id });

  if (invoice.nInvoice) throw new invoiceErrors.InvoiceWithOrderNumber();
  if (_isInvalidDate(invoice.date)) throw new invoiceErrors.InvoiceInvalidDateInvoice();
};

const editBody = ({
  body: {
    date,
    totals,
  },
}) => {
  if (date === undefined && !totals) throw new invoiceErrors.InvoiceParamsMissing();
};

const isRemovable = async ({ id }) => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id });
  const year = new Date(invoice.date).getFullYear();
  const lastDocument = await AutoIncrement.findOne({ name: `clientInvoice${year}` });
  let lastNumber;
  if (invoice.nInvoice)
    lastNumber = Number(invoice.nInvoice.split('/')[1]);

  // Si está confirmada y no es la última factura del año no se puede borrar
  if (invoice.nInvoice && lastDocument?.seq && lastNumber !== lastDocument?.seq)
    throw new invoiceErrors.InvoiceNoRemovable();
};

/**
 * Check if invalid date
 * @param {number} date
 * @private
 */
const isValidDate = ({ body: { date } }) => {
  if (!date || typeof date !== 'number')
    throw new commonErrors.DateNotValid();
};

const validateProduct = ({
  body: {
    name,
    iva,
    unit,
    price,
  },
}) => {
  if (!isNumber(iva) || !isNumber(price) || !name || !isNumber(unit))
    throw new invoiceErrors.InvoiceParamsMissing();
};

const validatePayment = ({
  body: {
    amount,
    date,
    paymentType,
  },
}) => {
  if (!isNumber(amount) || !isNumber(date) || !paymentType)
    throw new invoiceErrors.InvoiceParamsMissing();
};

module.exports = {
  validateId,
  validateIdParam,
  editBody,
  isRemovable,
  isValidDate,
  validateProduct,
  isValidForConfirmed,
  validatePayment,
};
