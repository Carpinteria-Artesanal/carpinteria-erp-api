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
  paymentsResponse,
};
