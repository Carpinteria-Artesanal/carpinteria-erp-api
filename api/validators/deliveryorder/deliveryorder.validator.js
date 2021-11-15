const {
  DeliveryOrderModel,
} = require('carpinteria-erp-models');
const {
  deliveryOrderErrors,
  commonErrors,
} = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const deliveryOrderExist = await DeliveryOrderModel.exists({ _id: id });
  if (!deliveryOrderExist) throw new deliveryOrderErrors.DeliveryOrderNotFound();
};

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);

/**
 * Valida los parametros para añadir o modificar un producto
 * @param quantity
 * @param product
 * @param price
 * @returns {Promise<void>}
 */
const validateProductParams = async ({
  body: {
    quantity,
    product,
    price,
  },
}) => {
  if (!quantity || !product || typeof price !== 'number') throw new deliveryOrderErrors.DeliveryOrderMissing();
};

/**
 * Comprueba que existe el índice del producto en el albarán
 * @param {string} id
 * @param {number} index
 * @returns {Promise<void>}
 */
const validateProductIndex = async ({
  id,
  index,
}) => {
  if (index < 0) throw new deliveryOrderErrors.DeliveryOrderProductIndexNotFound();
  const { products } = await DeliveryOrderModel.findOne({ _id: id });

  if (index >= products.length) throw new deliveryOrderErrors.DeliveryOrderProductIndexNotFound();
};

const validateProductIndexParams = ({ params }) => validateProductIndex(params);

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const hasDate = async ({ params: { id } }) => {
  const deliveryOrder = await DeliveryOrderModel.findOne({ _id: id });
  if (!deliveryOrder.date) throw new deliveryOrderErrors.DeliveryOrderDateRequired();
};

/**
 * Check if year if valid
 * @param {String} year
 */
const isValidYear = ({ year }) => {
  // eslint-disable-next-line no-restricted-globals,radix
  if (!parseInt(year)) throw new commonErrors.ParamNotValidError();
};

module.exports = {
  validateId,
  validateIdParam,
  validateProductParams,
  validateProductIndex,
  validateProductIndexParams,
  hasDate,
  isValidYear,
};
