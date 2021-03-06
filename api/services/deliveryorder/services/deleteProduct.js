const { ClientInvoiceModel } = require('carpinteria-erp-models');

/**
 * Delete product of delivery order in invoice
 * @param {Object} data
 */
const deleteProduct = async ({
  id,
  product,
}) => ClientInvoiceModel.findOneAndUpdate({
  _id: id,
}, { $pull: { products: { _id: product } } },
{ new: true });

module.exports = deleteProduct;
