const {
  BudgetModel,
  ClientModel,
} = require('carpinteria-erp-models');

/**
 * Create invoice for client
 * @param {String} clientId
 */
const create = async ({ client }) => {
  const clientData = await ClientModel.findOne({ _id: client });
  const newDO = await new BudgetModel({
    client,
    nameClient: clientData.name,
  }).save();

  return {
    id: newDO._id,
  };
};

module.exports = create;
