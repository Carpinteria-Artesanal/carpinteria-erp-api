/* eslint-disable nonblock-statement-body-position */
const {
  ProductModel,
} = require('carpinteria-erp-models');

/**
 * Create product
 * @return {Promise<string>}
 */
const createForClients = ({
  code,
  name,
  price,
}) => new ProductModel({
  name,
  price,
  code,
}).save();

module.exports = createForClients;
