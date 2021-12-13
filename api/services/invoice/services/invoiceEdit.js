const {
  InvoiceModel,
  BillingModel,
} = require('carpinteria-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Get all data for update
 * @param {Object} data
 * @param {Object} totals
 * @returns {{}}
 * @private
 */
const _getDataForUpdate = (data, totals) => {
  let newData = {};
  if (data) {
    const {
      dateRegister,
      dateInvoice,
      nInvoice,
      concept,
      mailSend,
    } = data;
    newData = {
      dateRegister,
      dateInvoice,
      nInvoice,
      concept,
      mailSend,
    };
  }

  if (totals) {
    const {
      total,
      paymentType,
    } = totals;
    newData = {
      ...newData,
      total: roundNumber(total),
      ...(paymentType && { paymentType }),
    };
  }

  return newData;
};

const _refreshBilling = async (id, invoice) => {
  await BillingModel.updateOne({
    $or: [
      { 'invoicesTrimester0.invoice': id },
      { 'invoicesTrimester1.invoice': id },
      { 'invoicesTrimester2.invoice': id },
      { 'invoicesTrimester3.invoice': id },
    ],
  }, {
    $set: {
      'invoicesTrimester3.$[j].total': invoice.invoice?.total,
      'invoicesTrimester3.$[j].date': invoice.invoice?.dateInvoice,
    },
  }, {
    arrayFilters: [{ 'j.invoice': id }],
  });
};

/**
 * Modifica la factura
 * @param {String} id
 * @param {{dateRegister: number, dateInvoice: number, nInvoice: string}} data
 * @param {{total: number, iva: number, re: number, rate: number, taxBase: number}} totals
 * @returns {*}
 */
const invoiceEdit = async ({
  params: { id },
  body: {
    data,
    totals,
  },
}) => {
  const newData = _getDataForUpdate(data, totals);

  const invoice = await InvoiceModel
    .findOneAndUpdate({ _id: id }, newData, { new: true })
    .then(invoiceUpdated => ({
      invoice: invoiceUpdated,
      data: Boolean(data),
      totals: Boolean(totals),
    }));

  // eslint-disable-next-line
  if (invoice.invoice?.nOrder && (data?.dateInvoice || totals?.total)) {
    await _refreshBilling(id, invoice);
  }

  return invoice;
};

module.exports = invoiceEdit;
