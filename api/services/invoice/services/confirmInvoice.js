/* eslint-disable nonblock-statement-body-position */
const {
  InvoiceModel,
} = require('carpinteria-erp-models');

/**
 * Edit product in delivery order invoice
 * @param {String} id
 * @param {String} invoice
 */
const confirm = async ({
  invoice,
  id,
}) => {
  const invoiceData = await InvoiceModel.findOneAndUpdate({
    _id: invoice,
    'payments._id': id,
  }, {
    $set: {
      'payments.$[j].paid': true,
    },
  }, {
    new: true,
    arrayFilters: [{ 'j._id': id }],
  });

  if (invoiceData.payments.every(payment => !!payment.paid)) {
    await InvoiceModel.findOneAndUpdate({
      _id: invoice,
      'payments._id': id,
    }, { paid: true });
  }
};

module.exports = confirm;
