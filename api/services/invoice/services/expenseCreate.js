const { InvoiceModel, ProviderModel } = require('carpinteria-erp-models');

const generateOrderNumber = require('../../../../components/generate-num-order');

/**
 * Create invoice
 * @param {Object} data
 */
const create = async ({
  nInvoice, dateInvoice, dateRegister, total, provider, concept, paymentType, payments,
  bookColumn,
}) => {
  const { name, businessName, cif } = await ProviderModel.findOne({ _id: provider });

  const nOrder = await generateOrderNumber(dateInvoice);

  const invoice = {
    nOrder,
    nameProvider: name,
    businessName,
    cif,
    nInvoice,
    dateInvoice,
    dateRegister,
    provider,
    concept,
    bookColumn,
    total,
    paymentType,
    payments,
  };

  return new InvoiceModel(invoice).save();
};

module.exports = create;
