const { ClientInvoiceModel } = require('carpinteria-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Actualiza la factura
 * @param {Object} invoice
 * @returns {Promise<{invoice}|*>}
 */
const refresh = invoice => {
  const totals = invoice.products.reduce(
    ({
      total,
      taxBase,
    }, current) => ({
      total: total + current.total,
      taxBase: taxBase + current.taxBase,
    }),
    {
      taxBase: 0,
      total: 0,
    },
  );

  const taxBase = roundNumber(totals.taxBase);
  const total = roundNumber(totals.total);
  const iva = roundNumber(total - taxBase);
  return ClientInvoiceModel.findOneAndUpdate({ _id: invoice._id }, {
    total,
    iva,
    taxBase,
  }, { new: true });
};

module.exports = refresh;
