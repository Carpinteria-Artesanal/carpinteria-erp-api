const carbone = require('carbone');
const { DeliveryOrderModel, ClientModel } = require('carpinteria-erp-models');
const { formatDate } = require('../../../../utils');

/* istanbul ignore next */
const _productAdapter = product => ({
  descripcion: product.name,
  unidades: `${product.unit.toLocaleString('es-ES')}`,
  precio: `${product.price.toLocaleString('es-ES')} €`,
  importe: `${product.total.toLocaleString('es-ES')} €`,
});

/* istanbul ignore next */
const _invoicesAdapter = invoice => ({
  fecha: formatDate(invoice.date),
  nFactura: invoice.nInvoice,
  empresa: invoice.client.businessName,
  direccion: invoice.client.address,
  ciudad: invoice.client.city,
  cp: invoice.client.postalCode,
  provincia: invoice.client.province,
  cif: invoice.client.cif,
  filas: invoice.products.map(_productAdapter),
  base: invoice.taxBase,
  iva: invoice.iva,
  total: invoice.total,
});

/* istanbul ignore next */
const _getInvoice = async id => {
  const invoice = await DeliveryOrderModel.findOne({ _id: id }).populate('client', null, ClientModel);

  return _invoicesAdapter(invoice);
};

/* istanbul ignore next */
const exportOds = async ({ id }) => {
  const invoice = await _getInvoice(id);

  let bookFile = null;
  let error = null;

  carbone.render('./plantillas/factura.ods', invoice, {
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
