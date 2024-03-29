const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const ClientInvoiceController = require('./clientInvoices.controller');

module.exports = (
  {
    invoiceService,
    paymentService,
    billingService,
    autoIncrementService,
    clientInvoiceService,
    productService,
  },
  {
    invoiceValidator,
    providerValidator,
    clientValidator,
    clientInvoiceValidator,
  },
  {
    invoiceAdapter,
    clientInvoiceAdapter,
  },
) => {
  const clientInvoicesController = new ClientInvoiceController({
    invoiceService,
    paymentService,
    errorHandler,
    invoiceValidator,
    invoiceAdapter,
    billingService,
    providerValidator,
    autoIncrementService,
    clientValidator,
    clientInvoiceService,
    clientInvoiceValidator,
    clientInvoiceAdapter,
    productService,
  });

  return [{
    method: 'post',
    domain: 'client/invoices',
    path: '/',
    handler: clientInvoicesController.create,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'client/invoices',
    path: '/',
    handler: clientInvoicesController.invoices,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'client/invoices',
    path: '/unpaid',
    handler: clientInvoicesController.unpaidInvoices,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'client/invoices',
    path: '/:id',
    handler: clientInvoicesController.edit,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'client/invoices',
    path: '/:id',
    handler: clientInvoicesController.delete,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'client/invoices',
    path: '/short',
    handler: clientInvoicesController.invoicesShort,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'client/invoices',
    path: '/billing',
    handler: clientInvoicesController.billing,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'client/invoices',
    path: '/billing/export',
    handler: clientInvoicesController.billingExport,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'client/invoices',
    path: '/:id',
    handler: clientInvoicesController.invoice,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'client/invoices',
    path: '/:id/product',
    handler: clientInvoicesController.addProduct,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'client/invoices',
    path: '/:id/product/:product',
    handler: clientInvoicesController.editProduct,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'client/invoices',
    path: '/:id/product/:product',
    handler: clientInvoicesController.deleteProduct,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'client/invoices',
    path: '/:id/confirm',
    handler: clientInvoicesController.invoiceConfirm,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'post',
    domain: 'client/invoices',
    path: '/:id/payments',
    handler: clientInvoicesController.addPayment,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'client/invoices',
    path: '/export/:id',
    handler: clientInvoicesController.export,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'client/invoices',
    path: '/export/:year/:month',
    handler: clientInvoicesController.export,
    bindTo: clientInvoicesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  ];
};
