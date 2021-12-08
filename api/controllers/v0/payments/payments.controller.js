const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'PaymentController';

const logService = new LogService(TYPE);

class PaymentsController {
  constructor({
    paymentService,
    errorHandler,
    paymentValidator,
    productValidator,
    paymentAdapter,
  }) {
    this.errorHandler = errorHandler;
    this.paymentService = paymentService;
    this.paymentValidator = paymentValidator;
    this.productValidator = productValidator;
    this.paymentAdapter = paymentAdapter;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'PaymentDivideNotMerged':
    case 'DateNotValid':
    case 'MissingParamsError':
    case 'PaymentsMissing':
      this.errorHandler.sendBadRequest(res)(error);
      break;
    case 'PaymentIdNotFound':
      this.errorHandler.sendNotFound(res)(error);
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
  payments(req, res) {
    logService.logInfo('[payment]  - Lista de pagos no pagados');
    Promise.resolve(req.query)
      .then(this.paymentService.payments)
      .then(this.paymentAdapter.paymentsResponse)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  confirm(req, res) {
    logService.logInfo('[payment]  - Confirma la realización del pago');
    Promise.resolve(req)
      .tap(this.paymentValidator.validateIdParam)
      .tap(this.paymentValidator.confirmParams)
      .then(this.paymentService.confirm)
      .then(this.paymentService.payments)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = PaymentsController;
