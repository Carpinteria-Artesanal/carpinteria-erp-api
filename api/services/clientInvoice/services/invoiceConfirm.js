const { ClientInvoiceModel } = require('carpinteria-erp-models');
const generateNumberInvoice = require('../../../../components/generate-num-invoice');

/**
 * Genera el número de factura
 * @param {String} id
 * @returns {{nInvoice: String}}
 */
const invoiceConfirm = async ({ id }) => {
  const invoiceData = await ClientInvoiceModel.findOne({ _id: id });

  let num = await generateNumberInvoice(invoiceData.date);
  const date = new Date(invoiceData.date).getFullYear();
  if (num < 10) num = `0${num}`;
  if (num < 100) num = `0${num}`;
  const nInvoice = `${date}/${num}`;

  await ClientInvoiceModel.updateOne({ _id: id }, { nInvoice, remaining: invoiceData.total });

  return { nInvoice };
};

module.exports = invoiceConfirm;
