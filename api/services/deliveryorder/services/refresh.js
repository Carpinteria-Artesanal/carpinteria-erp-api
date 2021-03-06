const { DeliveryOrderModel } = require('carpinteria-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Actualiza el albaran
 * @param {Object} invoice
 * @returns {Promise<{invoice}|*>}
 */
const refresh = deliveryOrder => {
  const totals = deliveryOrder.products.reduce(
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
  return DeliveryOrderModel.findOneAndUpdate({ _id: deliveryOrder._id }, {
    total,
    iva,
    taxBase,
  }, { new: true });
};

module.exports = refresh;
