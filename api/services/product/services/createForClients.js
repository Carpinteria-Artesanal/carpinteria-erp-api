/* eslint-disable nonblock-statement-body-position */
const {
  ProductModel,
} = require('carpinteria-erp-models');

/**
 * Create product
 * @return {Promise<string>}
 */
const createForClients = ({
  name,
  price,
}) => new ProductModel({
  name,
  price,
}).save();

module.exports = createForClients;
