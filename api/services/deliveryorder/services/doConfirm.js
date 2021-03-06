const { DeliveryOrderModel } = require('carpinteria-erp-models');
const generateNumberDeliveryOrder = require('../../../../components/generate-num-delivery-order');

/**
 * Genera el número de factura
 * @param {String} id
 * @returns {{nInvoice: String}}
 */
const doConfirm = async ({ id }) => {
  const doData = await DeliveryOrderModel.findOne({ _id: id });

  let num = await generateNumberDeliveryOrder(doData.date);
  const date = new Date(doData.date).getFullYear();
  if (num < 10) num = `0${num}`;
  if (num < 100) num = `0${num}`;
  const nInvoice = `${date}/${num}`;

  await DeliveryOrderModel.updateOne({ _id: id }, { nInvoice });

  return { nInvoice };
};

module.exports = doConfirm;
