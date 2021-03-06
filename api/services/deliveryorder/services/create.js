const {
  DeliveryOrderModel,
  ClientModel,
} = require('carpinteria-erp-models');

/**
 * Create invoice for client
 * @param {String} clientId
 */
const create = async ({ client }) => {
  const clientData = await ClientModel.findOne({ _id: client });
  const newInvoice = await new DeliveryOrderModel({
    client,
    nameClient: clientData.name,
  }).save();

  return {
    id: newInvoice._id,
  };
};

module.exports = create;
