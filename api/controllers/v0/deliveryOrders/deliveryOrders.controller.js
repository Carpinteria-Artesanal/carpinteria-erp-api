const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'ClientInvoiceController';

const logService = new LogService(TYPE);

class DeliveryOrdersController {
  constructor({
    errorHandler,
    invoiceValidator,
    autoIncrementService,
    clientValidator,
    deliveryOrderService,
    deliveryOrderValidator,
    deliveryOrderAdapter,
  }) {
    this.errorHandler = errorHandler;
    this.invoiceValidator = invoiceValidator;
    this.autoIncrementService = autoIncrementService;
    this.clientValidator = clientValidator;
    this.deliveryOrderService = deliveryOrderService;
    this.deliveryOrderValidator = deliveryOrderValidator;
    this.deliveryOrderAdapter = deliveryOrderAdapter;
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
  deliveryorder(req, res) {
    logService.logInfo('[deliveryorder]  - Get delivery order of client');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.validateId)
      .then(this.deliveryOrderService.deliveryOrder)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return all client invoices
   */
  orders(req, res) {
    logService.logInfo('[orders] - List of delivery orders');
    Promise.resolve(req.query)
      .tap(this.deliveryOrderValidator.isValidYear)
      .then(this.deliveryOrderService.orders)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  ordersShort(req, res) {
    logService.logInfo(
      '[ordersShort] - List of delivery orders with short info',
    );
    Promise.resolve(req.query)
      .tap(this.clientValidator.validateClient)
      .then(this.deliveryOrderService.ordersShort)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Create the delivery order
   */
  create(req, res) {
    logService.logInfo('[create] - Crea un albaran');
    Promise.resolve(req.body)
      .tap(this.clientValidator.validateClient)
      .then(this.deliveryOrderService.create)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Delete invoice
   */
  delete(req, res) {
    logService.logInfo('[delete] - Eliminar un albaran');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.validateId)
      .then(this.deliveryOrderService.doDelete)
      .then(() => res.status(204)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the client invoice
   */
  edit(req, res) {
    logService.logInfo('[edit]  - Edit client invoices');
    Promise.resolve(req)
      .tap(this.deliveryOrderValidator.validateIdParam)
      .tap(this.deliveryOrderValidator.editBody)
      .then(this.deliveryOrderService.doEdit)
      .then(this.deliveryOrderAdapter.conditionalDataTotalsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Add product to the delivery order
   */
  addProduct(req, res) {
    logService.logInfo('[addProduct]  - Añade un producto a un albarán');
    Promise.resolve(req)
      .tap(this.deliveryOrderValidator.validateIdParam)
      .tap(this.deliveryOrderValidator.validateProduct)
      .then(this.deliveryOrderService.addProduct)
      .then(this.deliveryOrderService.refresh)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit product to the delivery order
   */
  editProduct(req, res) {
    logService.logInfo('[editProduct]  - Edita un producto de un albarán');
    Promise.resolve(req)
      .tap(this.deliveryOrderValidator.validateIdParam)
      .tap(this.deliveryOrderValidator.validateProduct)
      .then(this.deliveryOrderService.editProduct)
      .then(this.deliveryOrderService.refresh)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Delete product to the delivery order
   */
  deleteProduct(req, res) {
    logService.logInfo('[deleteProduct] - Elimina un producto de un albarán');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.validateId)
      .then(this.deliveryOrderService.deleteProduct)
      .then(this.deliveryOrderService.refresh)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Generate nInvoice
   */
  invoiceConfirm(req, res) {
    logService.logInfo('[invoiceConfirm]  - Confirm invoice');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.validateId)
      .tap(this.deliveryOrderValidator.isValidForConfirmed)
      .then(this.deliveryOrderService.doConfirm)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  export(req, res) {
    logService.logInfo('[inovice]  - Export invoice to ods');
    Promise.resolve(req.params)
      .tap(this.deliveryOrderValidator.validateId)
      .then(this.deliveryOrderService.exportOds)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = DeliveryOrdersController;
