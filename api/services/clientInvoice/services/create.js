const {
  ClientInvoiceModel,
  ClientModel,
} = require('carpinteria-erp-models');

/**
 * Create invoice for client
 * @param {String} clientId
 */
const create = async ({ client }) => {
  // TODO: Posibiliad de recibir albaran y copiar su contenido
  const clientData = await ClientModel.findOne({ _id: client });
  const newInvoice = await new ClientInvoiceModel({
    client,
    nameClient: clientData.name,
  }).save();

  return {
    id: newInvoice._id,
  };
};

module.exports = create;
