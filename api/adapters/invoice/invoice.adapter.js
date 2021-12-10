/**
 * devuelve un objecto con los datos de la factura
 * @param invoice
 * @returns {{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}}
 */
const dataResponse = invoice => ({
  dateRegister: invoice.dateRegister,
  dateInvoice: invoice.dateInvoice,
  nOrder: invoice.nOrder,
  nInvoice: invoice.nInvoice,
  concept: invoice.concept,
  mailSend: invoice.mailSend,
});

/**
 * Devuelve los totales de la factura
 * @param invoice
 * @returns {{total: *, re: *, iva: *, taxBase: *}}
 */
const totalsResponse = invoice => ({
  taxBase: invoice.taxBase,
  iva: invoice.iva,
  total: invoice.total,
});

/**
 * devuelve un objecto con los dato y totales de la factura
 * @param {object} invoice
 * @returns {{data: {nOrder: *, dateRegister: (number|Requireable<number>),
 * dateInvoice: number, nInvoice: (string|Requireable<string>|Requireable<number>|string)},
 * totals: {total: *, re: *, iva: *, taxBase: *}}}
 */
const dataAndTotalsResponse = invoice => ({
  data: dataResponse(invoice),
  totals: totalsResponse(invoice),
});

/**
 * devuelve un objecto con los dato y totales de la factura
 * @param {object} invoice
 * @returns {{data: {nOrder: *, dateRegister: (number|Requireable<number>),
 * dateInvoice: number, nInvoice: (string|Requireable<string>|Requireable<number>|string)},
 * totals: {total: *, re: *, iva: *, taxBase: *}}}
 */
const dataAndPaymentResponse = invoice => ({
  data: dataResponse(invoice),
  payments: invoice.payments,
});

/**
 * Return data or/and totals of the invoice
 * @param {Object} invoice
 * @param {Boolean} data
 * @param {Boolean} totals
 * @returns {{}}
 */
const conditionalDataTotalsResponse = ({
  invoice,
  data,
  totals,
}) => ({
  ...(data && { data: dataResponse(invoice) }),
  ...(totals && { totals: totalsResponse(invoice) }),
});

/**
 * Return adapted object with invoice data
 * @param invoice
 * @returns {{deliveryOrders: {date: *, total: *, products: *}[],
 * data: {nOrder: (number|{$exists: boolean}|Number|NumberConstructor),
 * dateRegister: Number | NumberConstructor | Requireable<number>,
 * dateInvoice: Number | NumberConstructor | Requireable<number>,
 * nInvoice: String | StringConstructor}, provider: *,
 * totals: {total: *, re: *, iva: *, taxBase: *},
 * nameProvider: (null|Requireable<string>)}}
 */
const fullResponse = invoice => ({
  id: invoice._id,
  provider: invoice.provider,
  nameProvider: invoice.nameProvider,
  ...dataAndTotalsResponse(invoice),
  paid: invoice.paid,
  payments: invoice.payments,
  paymentType: invoice.paymentType,
});

const compareDate = (a, b) => {
  if (a.paymentDate < b.paymentDate) return -1;

  if (a.paymentDate > b.paymentDate) return 1;

  return 0;
};

/**
 * devuelve un objecto con los datos de la factura
 * @param invoice
 * @returns {{nOrder: *, dateRegister: *, dateInvoice: number, nInvoice: *}}
 */
const paymentsResponse = invoices => invoices.map(invoice => invoice.payments
  .filter(payment => !payment.paid)
  .map(payment => ({
    nOrder: invoice.nOrder,
    invoiceDate: invoice.dateInvoice,
    nInvoice: invoice.nInvoice,
    provider: invoice.nameProvider,
    type: invoice.paymentType,
    amount: payment.amount,
    paymentDate: payment.paymentDate,
    id: payment._id,
    invoiceId: invoice._id,
  })))
  .flat()
  .sort(compareDate);

module.exports = {
  fullResponse,
  dataAndTotalsResponse,
  dataResponse,
  conditionalDataTotalsResponse,
  dataAndPaymentResponse,
  paymentsResponse,
};
