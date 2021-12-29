const carbone = require('carbone');
const { ClientInvoiceModel, ClientModel } = require('carpinteria-erp-models');
const { formatDate } = require('../../../../utils');

const INVOICE_1_TEMPLATE = './plantillas/albaran-1-hoja.ods';
const INVOICE_2_TEMPLATE = './plantillas/albaran-2-hojas.ods';
const INVOICE_3_TEMPLATE = './plantillas/albaran-3-hojas.ods';

/* istanbul ignore next */
const _productAdapter = product => ({
  descripcion: product.name,
  ref: product.code,
  unidades: `${product.unit.toLocaleString('es-ES')}`,
  precio: `${product.price.toLocaleString('es-ES')} €`,
  importe: `${product.taxBase.toLocaleString('es-ES')} €`,
});

/* istanbul ignore next */
const _invoicesAdapter = invoice => {
  const filasAll = invoice.products.map(_productAdapter)
    .flat();

  return ({
    fecha: formatDate(invoice.date),
    nFactura: invoice.nInvoice,
    empresa: invoice.client.businessName,
    direccion: invoice.client.address,
    ciudad: invoice.client.city,
    cp: invoice.client.postalCode,
    provincia: invoice.client.province,
    cif: invoice.client.cif,
    filas: filasAll.slice(0, 48),
    filas2: filasAll.slice(49, 97),
    filas3: filasAll.slice(98, 200),
    nFilas: filasAll.length,
    base: invoice.taxBase,
    iva: invoice.iva,
    ivaTexto: invoice.products?.[0]?.iva || 0,
    total: invoice.total,
  });
};

/* istanbul ignore next */
const _getInvoice = async id => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id }).populate('client', null, ClientModel);

  return _invoicesAdapter(invoice);
};

const _getTemplate = ({ nFilas }) => {
  if (nFilas < 30) return INVOICE_1_TEMPLATE;
  if (nFilas < 59) return INVOICE_2_TEMPLATE;
  return INVOICE_3_TEMPLATE;
};

/* istanbul ignore next */
const exportOds = async ({ id }) => {
  const invoice = await _getInvoice(id);

  let bookFile = null;
  let error = null;

  const template = _getTemplate(invoice);

  carbone.render(template, invoice, {
    lang: 'es-es',
  }, (err, result) => {
    /* istanbul ignore next */
    if (err) {
      error = err;
      return;
    }
    bookFile = result;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      /* istanbul ignore next */
      if (error) reject(error);
      /* istanbul ignore next */
      if (bookFile) resolve(bookFile);
    }, 100);
  });
};

module.exports = exportOds;
