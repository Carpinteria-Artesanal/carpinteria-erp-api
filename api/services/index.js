const AccountService = require('./account.service');
const AutoIncrementService = require('./autoincrement');
const BillingService = require('./billing');
const BudgetService = require('./budget');
const ClientInvoiceService = require('./clientInvoice');
const ClientService = require('./client');
const DeliveryOrderService = require('./deliveryorder');
const InvoiceService = require('./invoice');
const NoteService = require('./note');
const ProductService = require('./product');
const ProviderService = require('./provider');
const ReminderService = require('./reminder');

module.exports = {
  accountService: AccountService,
  autoIncrementService: AutoIncrementService,
  billingService: BillingService,
  budgetService: BudgetService,
  clientInvoiceService: ClientInvoiceService,
  clientService: ClientService,
  deliveryOrderService: DeliveryOrderService,
  invoiceService: InvoiceService,
  noteService: NoteService,
  productService: ProductService,
  providerService: ProviderService,
  reminderService: ReminderService,
};
