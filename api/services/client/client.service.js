const { ClientModel } = require('carpinteria-erp-models');

const ClientInvoiceService = require('../clientInvoice');
const DeliveryOrderServices = require('../deliveryorder');
const BudgetServices = require('../budget');

/**
 * Return all providers
 * @return {Promise<{data: any}>}
 */
const clients = async ({
  name,
  phone,
  email,
  offset,
  limit,
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

  const clientList = await ClientModel.find(filter, 'name _id address phone email')
    .collation({ locale: 'es' })
    .skip(Number(offset || 0))
    .limit(Number(limit || 20))
    .sort({ name: 1 })
    .lean();

  const count = await ClientModel.countDocuments(filter);
  return {
    clients: clientList,
    count,
  };
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

  const budgets = await BudgetServices.ordersShort({
    client: id,
    limit: 10,
  });

  return {
    client: clientData,
    invoices,
    deliveryOrders,
    budgets,
  };
};

module.exports = {
  clients,
  create,
  update,
  client,
};
