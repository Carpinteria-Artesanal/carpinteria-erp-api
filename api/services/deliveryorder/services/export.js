const carbone = require('carbone');
const { DeliveryOrderModel, ClientModel } = require('carpinteria-erp-models');
const { formatDate } = require('../../../../utils');

const DELIVERY_ORDER_1_TEMPLATE = './plantillas/albaran-1-hoja.ods';
const DELIVERY_ORDER_2_TEMPLATE = './plantillas/albaran-2-hojas.ods';
const DELIVERY_ORDER_3_TEMPLATE = './plantillas/albaran-3-hojas.ods';

/* istanbul ignore next */
const _productAdapter = product => ({
  descripcion: product.name,
  ref: product.code,
  unidades: `${product.unit.toLocaleString('es-ES')}`,
  precio: `${product.price.toLocaleString('es-ES')} €`,
  importe: `${product.taxBase.toLocaleString('es-ES')} €`,
});

/* istanbul ignore next */
const _deliveryOrderAdapter = deliveryOrder => {
  const filasAll = deliveryOrder.products.map(_productAdapter)
    .flat();

  return ({
    fecha: formatDate(deliveryOrder.date),
    nFactura: deliveryOrder.nInvoice,
    empresa: deliveryOrder.client.businessName,
    direccion: deliveryOrder.client.address,
    ciudad: deliveryOrder.client.city,
    cp: deliveryOrder.client.postalCode,
    provincia: deliveryOrder.client.province,
    cif: deliveryOrder.client.cif,
    filas: filasAll.slice(0, 48),
    filas2: filasAll.slice(49, 97),
    filas3: filasAll.slice(98, 200),
    nFilas: filasAll.length,
    base: deliveryOrder.taxBase,
    iva: deliveryOrder.iva,
    ivaTexto: deliveryOrder.products?.[0]?.iva || 0,
    total: deliveryOrder.total,
  });
};

/* istanbul ignore next */
const _getDeliveryOrder = async id => {
  const deliveryOrder = await DeliveryOrderModel.findOne({ _id: id }).populate('client', null, ClientModel);

  return _deliveryOrderAdapter(deliveryOrder);
};

const _getTemplate = ({ nFilas }) => {
  if (nFilas < 30) return DELIVERY_ORDER_1_TEMPLATE;
  if (nFilas < 59) return DELIVERY_ORDER_2_TEMPLATE;
  return DELIVERY_ORDER_3_TEMPLATE;
};

/* istanbul ignore next */
const exportOds = async ({ id }) => {
  const deliveryOrder = await _getDeliveryOrder(id);

  let bookFile = null;
  let error = null;

  const template = _getTemplate(deliveryOrder);

  carbone.render(template, deliveryOrder, {
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
