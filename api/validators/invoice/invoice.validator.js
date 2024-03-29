/* eslint-disable camelcase, nonblock-statement-body-position */
const {
  InvoiceModel,
  AutoIncrement,
  PaymentModel,
} = require('carpinteria-erp-models');
const {
  invoiceErrors,
  commonErrors,
} = require('../../../errors');
const {
  TYPE_PAYMENT,
} = require('../../../constants');
const {
  isNumber,
  roundNumber,
} = require('../../../utils');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const invoiceExist = await InvoiceModel.exists({ _id: id });
  if (!invoiceExist) throw new invoiceErrors.InvoiceIdNotFound();
};
/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);
const validateInvoice = ({ invoice }) => _checkId(invoice);
const validatePayment = async ({ id, invoice }) => {
  const invoiceExist = await InvoiceModel.exists({ _id: invoice, 'payments._id': id });
  if (!invoiceExist) throw new invoiceErrors.PaymentNotExist();
};
/**
 * Check if year if valid
 * @param {String} year
 */
const isValidYear = ({ year }) => {
  // eslint-disable-next-line no-restricted-globals,radix
  if (!parseInt(year)) throw new commonErrors.ParamNotValidError();
};

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
const confirmParams = async ({
  body: {
    type,
    paymentDate,
  },
  params: { id },
}) => {
  if (!type) throw new invoiceErrors.InvoiceParamsMissing();
  if (paymentDate && typeof paymentDate !== 'number') throw new commonErrors.DateNotValid();
  if (type === TYPE_PAYMENT.CASH && !paymentDate) throw new commonErrors.DateNotValid();

  const invoice = await InvoiceModel.findOne({ _id: id });

  if (_isInvalidDate(invoice.dateInvoice)) throw new invoiceErrors.InvoiceInvalidDateInvoice();
  if (invoice.nOrder) throw new invoiceErrors.InvoiceWithOrderNumber();
};

/**
 * Valida los datos envíados para crear una factura
 * @param concept
 * @param dateInvoice
 * @param dateRegister
 * @param total
 * @param provider
 * @param type
 * @param bookColumn
 * @param re
 */
const createParams = ({
  concept,
  dateInvoice,
  dateRegister,
  total,
  provider,
  bookColumn,
  paymentType,
  payments,
}) => {
  if (!concept || !bookColumn) throw new invoiceErrors.InvoiceParamsMissing();

  if (!isNumber(dateInvoice) || !isNumber(dateRegister) || !isNumber(total)
        || !provider || !paymentType || !payments?.length)
    throw new invoiceErrors.InvoiceParamsMissing();
};

const editBody = ({
  body: {
    data,
    totals,
  },
}) => {
  if (!data && !totals) throw new invoiceErrors.InvoiceParamsMissing();
};

const isRemovable = async ({ id }) => {
  const invoice = await InvoiceModel.findOne({ _id: id });
  const year = new Date(invoice.dateInvoice).getFullYear();
  const lastDocument = await AutoIncrement.findOne({ name: `invoice${year}` });

  // Si está confirmada y no es la última factura del año no se puede borrar
  if (invoice.nOrder && lastDocument?.seq && invoice.nOrder !== lastDocument?.seq)
    throw new invoiceErrors.InvoiceNoRemovable();

  // Comprueba que no exista ningún pago fusionado con esta factura
  const payments = await PaymentModel.find({ invoices: id });
  if (payments.length > 1)
    throw new invoiceErrors.PaymentMerged();
};

const validateNInvoice = async ({
  dateInvoice,
  nInvoice,
  provider,
}) => {
  const date = dateInvoice ? new Date(dateInvoice) : new Date();
  const startYear = date.getFullYear()
    .toString();
  const start = new Date(startYear);
  const end = new Date((startYear + 1).toString());
  const existInvoice = await InvoiceModel.exists({
    nInvoice,
    provider,
    dateRegister: {
      $gte: start,
      $lt: end,
    },
  });

  if (existInvoice) throw new invoiceErrors.InvoiceExist();
};

const validateNInvoiceEdit = async ({
  body: { data },
  params: { id },
}) => {
  if (data?.nInvoice) {
    const invoice = await InvoiceModel.findOne({ _id: id });
    if (data.nInvoice !== invoice.nInvoice) {
      await validateNInvoice({
        ...data,
        provider: invoice.provider,
      });
    }
  }
};

module.exports = {
  confirmParams,
  validateId,
  validateIdParam,
  isValidYear,
  createParams,
  editBody,
  isRemovable,
  validateInvoice,
  validateNInvoice,
  validateNInvoiceEdit,
  validatePayment,
};
