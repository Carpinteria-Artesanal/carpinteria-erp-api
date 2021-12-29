const { ClientInvoiceModel } = require('carpinteria-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Add product to delivery order
 * @param {String} id
 * @param {String} name
 * @param {Number} iva
 * @param {Number} unit
 * @param {String} price
 * @return {Promise<void>}
 */
const addProduct = ({
  params: {
    id,
  },
  body: {
    name,
    unit,
    iva,
    price,
    code,
  },
}) => {
  const taxBase = roundNumber(unit * price);
  const ivaPercent = iva / 100;
  const total = roundNumber(taxBase * (ivaPercent + 1));
  return ClientInvoiceModel.findOneAndUpdate({
    _id: id,
  }, {
    $push: {
      products: {
        name,
        iva,
        unit,
        price,
        taxBase,
        total,
        code,
      },
    },
  }, { new: true });
};

module.exports = addProduct;
