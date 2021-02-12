/* eslint-disable nonblock-statement-body-position */
const { PriceModel, ProductModel } = require('carpinteria-erp-models');

/**
 * Get dates and prices of the product
 * @param product
 * @returns {*|Promise<void>|PromiseLike<any>|Promise<any>}
 */
const _getPricesOfProduct = product => PriceModel.find({ product })
  .sort({ date: -1 })
  .limit(25)
  .then(prices => prices.map(({
    date, price, cost, sale, deliveryOrder,
  }) => ({
    date,
    price,
    cost,
    sale,
    deliveryOrder,
  })));

/**
 * Return the product
 * @param {string} id
 * @returns {Object}
 */
const product = async ({ id }) => ({
  product: await ProductModel.findOne({ _id: id }),
  prices: await _getPricesOfProduct(id),
});

module.exports = product;
