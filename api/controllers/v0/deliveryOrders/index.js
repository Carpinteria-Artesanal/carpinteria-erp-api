const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const DeliveryOrderController = require('./deliveryOrders.controller');

module.exports = (
  {
    autoIncrementService,
    deliveryOrderService,
  },
  {
    clientValidator,
    deliveryOrderValidator,
  },
  {
    deliveryOrderAdapter,
  },
) => {
  const deliveryOrderController = new DeliveryOrderController({
    errorHandler,
    autoIncrementService,
    clientValidator,
    deliveryOrderValidator,
    deliveryOrderAdapter,
    deliveryOrderService,
  });

  return [{
    method: 'post',
    domain: 'deliveryorders',
    path: '/',
    handler: deliveryOrderController.create,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'deliveryorders',
    path: '/',
    handler: deliveryOrderController.orders,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'deliveryorders',
    path: '/:id',
    handler: deliveryOrderController.edit,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'deliveryorders',
    path: '/:id',
    handler: deliveryOrderController.delete,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'deliveryorders',
    path: '/short',
    handler: deliveryOrderController.ordersShort,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'deliveryorders',
    path: '/:id',
    handler: deliveryOrderController.deliveryorder,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'deliveryorders',
    path: '/:id/product',
    handler: deliveryOrderController.addProduct,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'put',
    domain: 'deliveryorders',
    path: '/:id/product/:product',
    handler: deliveryOrderController.editProduct,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'deliveryorders',
    path: '/:id/product/:product',
    handler: deliveryOrderController.deleteProduct,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'deliveryorders',
    path: '/:id/confirm',
    handler: deliveryOrderController.invoiceConfirm,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'deliveryorders',
    path: '/export/:id',
    handler: deliveryOrderController.export,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'deliveryorders',
    path: '/export/:year/:month',
    handler: deliveryOrderController.export,
    bindTo: deliveryOrderController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
