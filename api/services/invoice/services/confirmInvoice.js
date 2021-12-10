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
}) => InvoiceModel.updateOne({
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

module.exports = confirm;
