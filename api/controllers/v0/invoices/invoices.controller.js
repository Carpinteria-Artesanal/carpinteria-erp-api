const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'InvoiceController';

const logService = new LogService(TYPE);

class InvoicesController {
  constructor({
    invoiceService,
    errorHandler,
    invoiceAdapter,
    invoiceValidator,
    billingService,
    providerValidator,
    autoIncrementService,
  }) {
    this.invoiceService = invoiceService;
    this.errorHandler = errorHandler;
    this.invoiceAdapter = invoiceAdapter;
    this.invoiceValidator = invoiceValidator;
    this.billingService = billingService;
    this.providerValidator = providerValidator;
    this.autoIncrementService = autoIncrementService;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'InvoiceInvalidDateInvoice':
    case 'DateNotValid':
      this.errorHandler.sendValidationError(res)(error);
      break;
    case 'InvoiceIdNotFound':
    case 'PaymentNotExist':
      this.errorHandler.sendNotFound(res)(error);
      break;
    case 'InvoiceParamsMissing':
    case 'InvoiceNoRemovable':
    case 'PaymentMerged':
    case 'ParamNotValidError':
    case 'ProviderIdNotFound':
    case 'InvoiceWithOrderNumber':
    case 'InvoiceExist':
      this.errorHandler.sendBadRequest(res)(error);
      break;
      /* istanbul ignore next */
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
     * Return invoice
     */
  invoice(req, res) {
    logService.logInfo('[inovice]  - Get invoice');
    Promise.resolve(req.params)
      .tap(this.invoiceValidator.validateId)
      .then(this.invoiceService.invoice)
      .then(this.invoiceAdapter.fullResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
     * Return all invoices
     */
  invoices(req, res) {
    logService.logInfo('[invoices] - List of invoices');
    Promise.resolve(req.query)
      .tap(this.invoiceValidator.isValidYear)
      .then(this.invoiceService.invoices)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  invoicesShort(req, res) {
    logService.logInfo(
      '[invoicesShort] - List of invoices with short info',
    );
    Promise.resolve(req.query)
      .then(this.invoiceService.invoicesShort)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
     * Delete invoice
     */
  delete(req, res) {
    logService.logInfo('[invoices] - Eliminar factura');
    Promise.resolve(req.params)
      .tap(this.invoiceValidator.validateId)
      .tap(this.invoiceValidator.isRemovable)
      .then(this.invoiceService.invoiceDelete)
      .tap(this.autoIncrementService.decrementInvoice)
      .tap(this.billingService.remove)
      .tap(this.billingService.refresh)
      .then(() => res.status(204)
        .send())
      .catch(this._handleError.bind(this, res));
  }

  /**
     * Create the invoice
     */
  expenseCreate(req, res) {
    logService.logInfo('[invoices] - Create invoice for expense');
    Promise.resolve(req.body)
      .tap(this.providerValidator.validateProvider)
      .tap(this.invoiceValidator.createParams)
      .tap(this.invoiceValidator.validateNInvoice)
      .then(this.invoiceService.expenseCreate)
      .tap(this.billingService.add)
      .tap(this.billingService.refresh)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
     * Edit the invoice
     */
  edit(req, res) {
    logService.logInfo('[invoices]  - Edit invoices');
    Promise.resolve(req)
      .tap(this.invoiceValidator.validateIdParam)
      .tap(this.invoiceValidator.editBody)
      .tap(this.invoiceValidator.validateNInvoiceEdit)
      .then(this.invoiceService.invoiceEdit)
      .tap(this.billingService.refresh)
      .then(this.invoiceAdapter.conditionalDataTotalsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
     * Return invoice
     */
  invoiceConfirm(req, res) {
    logService.logInfo('[inovice]  - Confirm invoice');
    Promise.resolve(req)
      .tap(this.invoiceValidator.validateIdParam)
      .tap(this.invoiceValidator.confirmParams)
      .then(this.invoiceService.invoiceConfirm)
      .tap(this.paymentService.create)
      .tap(this.billingService.add)
      .tap(this.billingService.refresh)
      .then(this.invoiceAdapter.dataAndPaymentResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  export(req, res) {
    logService.logInfo('[inovice]  - Export invoices to book');
    Promise.resolve(req.query)
      .tap(this.invoiceValidator.isValidYear)
      .then(this.invoiceService.exportOds)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  payments(req, res) {
    logService.logInfo('[inovice]  - Lista de pagos pendientes');
    Promise.resolve(req.query)
      .then(this.invoiceService.payments)
      .then(this.invoiceAdapter.paymentsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  applyPayment(req, res) {
    logService.logInfo('[payment]  - Confirma la realización del pago');
    Promise.resolve(req.params)
      .tap(this.invoiceValidator.validateInvoice)
      .tap(this.invoiceValidator.validatePayment)
      .then(this.invoiceService.confirmInvoice)
      .then(this.invoiceService.payments)
      .then(this.invoiceAdapter.paymentsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = InvoicesController;
