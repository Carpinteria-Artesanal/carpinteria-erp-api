const { ClientModel } = require('carpinteria-erp-models');

const ClientInvoiceService = require('../clientInvoice');
const DeliveryOrderServices = require('../deliveryorder');

/**
 * Return all providers
 * @return {Promise<{data: any}>}
 */
const clients = ({
  name,
  phone,
  email,
}) => {
  const filter = {
    ...(name && {
      name: {
        $regex: name,
        $options: 'i',
      },
    }),
    ...(phone && { phone: { $regex: phone } }),
    ...(email && { email: { $regex: email } }),
  };

  return ClientModel.find(filter, 'name _id address phone email')
    .collation({ locale: 'es' })
    .sort({ name: 1 })
    .lean();
};

/**
 * Create product
 * @param {Object} data
 */
const create = data => new ClientModel(data).save();

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = ({
  params,
  body,
}) => (
  ClientModel.findOneAndUpdate({ _id: params.id }, { $set: body })
);

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const client = async ({ id }) => {
  const clientData = await ClientModel.findOne({ _id: id })
    .lean();
  const invoices = await ClientInvoiceService.invoicesShort({
    client: id,
    limit: 10,
  });
  const deliveryOrders = await DeliveryOrderServices.ordersShort({
    client: id,
    limit: 10,
  });

  return {
    client: clientData,
    invoices,
    deliveryOrders,
  };
};

module.exports = {
  clients,
  create,
  update,
  client,
};
