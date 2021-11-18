const { BudgetModel } = require('carpinteria-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Edit product in delivery order invoice
 * @param {String} id
 * @param {String} deliveryOrder
 * @param {String} product
 * @param {String} name
 * @param {number} iva
 * @param {string} unit
 * @param {number} price
 */
const editProduct = ({
  params: {
    id,
    product,
  },
  body: {
    name,
    unit,
    iva,
    price,
  },
}) => {
  const taxBase = roundNumber(unit * price);
  const ivaPercent = iva / 100;
  const total = roundNumber(taxBase * (ivaPercent + 1));
  return BudgetModel.findOneAndUpdate({
    _id: id,
    'products._id': product,
  }, {
    $set: {
      'products.$[j].name': name,
      'products.$[j].iva': iva,
      'products.$[j].taxBase': taxBase,
      'products.$[j].unit': unit,
      'products.$[j].price': price,
      'products.$[j].total': total,
    },
  }, {
    new: true,
    arrayFilters: [{ 'j._id': product }],
  });
};

module.exports = editProduct;
