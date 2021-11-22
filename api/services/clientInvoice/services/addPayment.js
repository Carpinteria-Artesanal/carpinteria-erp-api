const { ClientInvoiceModel } = require('carpinteria-erp-models');

/**
 * Add product to delivery order
 * @param {String} id
 * @param {Number} amount
 * @param {Number} date
 * @param {String} paymentType
 * @return {Promise<void>}
 */
const addPayment = ({
  params: {
    id,
  },
  body: {
    amount,
    date,
    paymentType,
  },
}) => ClientInvoiceModel.findOneAndUpdate({
  _id: id,
}, {
  $push: {
    payments: {
      amount,
      date,
      paymentType,
    },
  },
}, { new: true });

module.exports = addPayment;
