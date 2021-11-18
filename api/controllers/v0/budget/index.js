const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const BudgetController = require('./budgets.controller');

module.exports = (
  {
    autoIncrementService,
    budgetService,
  },
  {
    clientValidator,
    budgetValidator,
  },
  {
    budgetAdapter,
  },
) => {
  const budgetController = new BudgetController({
    errorHandler,
    autoIncrementService,
    clientValidator,
    budgetValidator,
    budgetAdapter,
    budgetService,
  });

  return [{
    method: 'post',
    domain: 'budgets',
    path: '/',
    handler: budgetController.create,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'budgets',
    path: '/',
    handler: budgetController.orders,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'budgets',
    path: '/:id',
    handler: budgetController.edit,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'budgets',
    path: '/:id',
    handler: budgetController.delete,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'budgets',
    path: '/short',
    handler: budgetController.ordersShort,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'budgets',
    path: '/:id',
    handler: budgetController.budget,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'budgets',
    path: '/:id/product',
    handler: budgetController.addProduct,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'put',
    domain: 'budgets',
    path: '/:id/product/:product',
    handler: budgetController.editProduct,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'budgets',
    path: '/:id/product/:product',
    handler: budgetController.deleteProduct,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'patch',
    domain: 'budgets',
    path: '/:id/confirm',
    handler: budgetController.invoiceConfirm,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'budgets',
    path: '/export/:id',
    handler: budgetController.export,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'get',
    domain: 'budgets',
    path: '/export/:year/:month',
    handler: budgetController.export,
    bindTo: budgetController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
