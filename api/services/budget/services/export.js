const carbone = require('carbone');
const { BudgetModel, ClientModel } = require('carpinteria-erp-models');
const { formatDate } = require('../../../../utils');

const BUDGET_1_TEMPLATE = './plantillas/presupuesto-1-hoja.ods';
const BUDGET_2_TEMPLATE = './plantillas/presupuesto-2-hojas.ods';
const BUDGET_3_TEMPLATE = './plantillas/presupuesto-3-hojas.ods';

/* istanbul ignore next */
const _productAdapter = product => ({
  descripcion: product.name,
  ref: product.code,
  unidades: `${product.unit.toLocaleString('es-ES')}`,
  precio: `${product.price.toLocaleString('es-ES')} €`,
  importe: `${product.taxBase.toLocaleString('es-ES')} €`,
});

/* istanbul ignore next */
const _budgetAdapter = budget => {
  const filasAll = budget.products.map(_productAdapter)
    .flat();

  return ({
    fecha: formatDate(budget.date),
    nFactura: budget.nInvoice,
    empresa: budget.client.businessName,
    direccion: budget.client.address,
    ciudad: budget.client.city,
    cp: budget.client.postalCode,
    provincia: budget.client.province,
    cif: budget.client.cif,
    filas: filasAll.slice(0, 48),
    filas2: filasAll.slice(49, 97),
    filas3: filasAll.slice(98, 200),
    nFilas: filasAll.length,
    base: budget.taxBase,
    iva: budget.iva,
    ivaTexto: budget.products?.[0]?.iva || 0,
    total: budget.total,
  });
};

/* istanbul ignore next */
const _getInvoice = async id => {
  const budget = await BudgetModel.findOne({ _id: id }).populate('client', null, ClientModel);

  return _budgetAdapter(budget);
};

const _getTemplate = ({ nFilas }) => {
  if (nFilas < 30) return BUDGET_1_TEMPLATE;
  if (nFilas < 59) return BUDGET_2_TEMPLATE;
  return BUDGET_3_TEMPLATE;
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
