const { ClientModel } = require('carpinteria-erp-models');
const nodeMail = require('../../../../components/nodemailer');

/**
 * Actualiza la factura
 * @param {number} invoice
 * @returns {Promise<{invoice}|*>}
 */
const sendMail = async ({
  invoiceId,
  clientId
}) => {
  // const invoice = ClientInvoiceModel.findOne({ _id: id });
  const client = await ClientModel.findOne({ _id: clientId });
  nodeMail({
    to: client.email,
    subject: 'Factura 23/12/2021',
    text: 'Texto de prueba',
  });
};

module.exports = sendMail;
