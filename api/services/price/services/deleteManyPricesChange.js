/* eslint-disable nonblock-statement-body-position */
const {
  PriceChangeModel,
} = require('carpinteria-erp-models');

const deleteManyPricesChange = ({
  ids,
}) => PriceChangeModel.deleteMany({ _id: { $in: ids } });

module.exports = deleteManyPricesChange;
