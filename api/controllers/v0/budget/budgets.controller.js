const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'BudgetController';

const logService = new LogService(TYPE);

class BudgetsController {
  constructor({
    errorHandler,
    autoIncrementService,
    clientValidator,
    budgetService,
    budgetValidator,
    budgetAdapter,
  }) {
    this.errorHandler = errorHandler;
    this.autoIncrementService = autoIncrementService;
    this.clientValidator = clientValidator;
    this.budgetService = budgetService;
    this.budgetValidator = budgetValidator;
    this.budgetAdapter = budgetAdapter;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'ClientIdNotFound':
    case 'DeliveryOrderNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
    case 'ParamNotValidError':
    case 'InvoiceParamsMissing':
    case 'InvoiceNoRemovable':
    case 'DateNotValid':
    case 'InvoiceInvalidDateInvoice':
      this.errorHandler.sendBadRequest(res)(error);
      break;
      /* istanbul ignore next */
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
   * Return delivery order
   */
  budget(req, res) {
    logService.logInfo('[budget]  - Get budget of client');
    Promise.resolve(req.params)
      .tap(this.budgetValidator.validateId)
      .then(this.budgetService.budget)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return all client invoices
   */
  orders(req, res) {
    logService.logInfo('[orders] - List of budget');
    Promise.resolve(req.query)
      .tap(this.budgetValidator.isValidYear)
      .then(this.budgetService.orders)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  ordersShort(req, res) {
    logService.logInfo(
      '[ordersShort] - List of budget with short info',
    );
    Promise.resolve(req.query)
      .tap(this.clientValidator.validateClient)
      .then(this.budgetService.ordersShort)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Create the delivery order
   */
  create(req, res) {
    logService.logInfo('[create] - Crea un presupuesto');
    Promise.resolve(req.body)
      .tap(this.clientValidator.validateClient)
      .then(this.budgetService.create)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Delete invoice
   */
  delete(req, res) {
    logService.logInfo('[delete] - Eliminar un presupuesto');
    Promise.resolve(req.params)
      .tap(this.budgetValidator.validateId)
      .then(this.budgetService.budgetDelete)
      .then(() => res.status(204)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the client invoice
   */
  edit(req, res) {
    logService.logInfo('[edit]  - Edit budget');
    Promise.resolve(req)
      .tap(this.budgetValidator.validateIdParam)
      .tap(this.budgetValidator.editBody)
      .then(this.budgetService.budgetEdit)
      .then(this.budgetAdapter.conditionalDataTotalsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add product to the delivery order
   */
  addProduct(req, res) {
    logService.logInfo('[addProduct]  - Añade un producto a un presupuesto');
    Promise.resolve(req)
      .tap(this.budgetValidator.validateIdParam)
      .tap(this.budgetValidator.validateProduct)
      .then(this.budgetService.addProduct)
      .then(this.budgetService.refresh)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit product to the delivery order
   */
  editProduct(req, res) {
    logService.logInfo('[editProduct]  - Edita un producto de un albarán');
    Promise.resolve(req)
      .tap(this.budgetValidator.validateIdParam)
      .tap(this.budgetValidator.validateProduct)
      .then(this.budgetService.editProduct)
      .then(this.budgetService.refresh)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Delete product to the delivery order
   */
  deleteProduct(req, res) {
    logService.logInfo('[deleteProduct] - Elimina un producto de un albarán');
    Promise.resolve(req.params)
      .tap(this.budgetValidator.validateId)
      .then(this.budgetService.deleteProduct)
      .then(this.budgetService.refresh)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Generate nInvoice
   */
  invoiceConfirm(req, res) {
    logService.logInfo('[invoiceConfirm]  - Confirm invoice');
    Promise.resolve(req.params)
      .tap(this.budgetValidator.validateId)
      .tap(this.budgetValidator.isValidForConfirmed)
      .then(this.budgetService.budgetConfirm)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  export(req, res) {
    logService.logInfo('[inovice]  - Export invoice to ods');
    Promise.resolve(req.params)
      .tap(this.budgetValidator.validateId)
      .then(this.budgetService.exportOds)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = BudgetsController;
