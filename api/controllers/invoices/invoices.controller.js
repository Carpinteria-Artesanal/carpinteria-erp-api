const Promise = require('bluebird');

const LogService = require('../../services/log.service');

const TYPE = 'InvoiceController';

const logService = new LogService(TYPE);

class InvoicesController {
  constructor({ invoiceService, errorHandler }, { invoiceAdapter }) {
    this.invoiceService = invoiceService;
    this.errorHandler = errorHandler;
    this.invoiceAdapter = invoiceAdapter;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'InvoiceInvalidDateInvoice':
    case 'InvoiceMissingDeliveryOrders':
    case 'InvoiceNotFoundDeliveryOrder':
      this.errorHandler.sendValidationError(res)(error);
      break;
    case 'InvoiceIdNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
    case 'InvoiceMissingId':
    case 'InvoiceParamsMissing':
      this.errorHandler.sendBadRequest(res)(error);
      break;
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
   * Create the invoice
   */
  create(req, res) {
    logService.logInfo('[invoices] - Create invoice');
    Promise.resolve(req.body)
      .then(this.invoiceService.create)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Edit the invoice
   */
  edit(req, res) {
    logService.logInfo('[invoices]  - Edit invoices');
    Promise.resolve(req)
      .then(this.invoiceService.invoiceEdit)
      .then(this.invoiceAdapter.conditionalDataTotalsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Return invoice
   */
  invoiceConfirm(req, res) {
    logService.logInfo('[inovice]  - Confirm invoice');
    Promise.resolve(req.params)
      .then(this.invoiceService.invoiceConfirm)
      .then(this.invoiceAdapter.dataResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = InvoicesController;
