const { BudgetModel } = require('carpinteria-erp-models');
const generateNumberBudget = require('../../../../components/generate-num-budget');

/**
 * Genera el número de factura
 * @param {String} id
 * @returns {{nInvoice: String}}
 */
const budgetConfirm = async ({ id }) => {
  const doData = await BudgetModel.findOne({ _id: id });

  let num = await generateNumberBudget(doData.date);
  const date = new Date(doData.date).getFullYear();
  if (num < 10) num = `0${num}`;
  if (num < 100) num = `0${num}`;
  const nInvoice = `${date}/${num}`;

  await BudgetModel.updateOne({ _id: id }, { nInvoice });

  return { nInvoice };
};

module.exports = budgetConfirm;
