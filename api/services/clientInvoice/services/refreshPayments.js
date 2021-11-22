const { ClientInvoiceModel } = require('carpinteria-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Actualiza la factura
 * @param {Object} invoice
 * @returns {Promise<{invoice}|*>}
 */
const refreshPayment = invoice => {
  const amountPaid = invoice.payments.reduce(
    (amount, current) => (amount + current),
    0,
  );

  const remaining = roundNumber(invoice.total - amountPaid);
  const paid = remaining > 0 ? undefined : true;

  return ClientInvoiceModel.findOneAndUpdate({ _id: invoice._id }, {
    remaining,
    paid,
  }, { new: true });
};

module.exports = refreshPayment;
