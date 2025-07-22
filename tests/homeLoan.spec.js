const { test } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');
const { HomeLoanPage } = require('../pages/HomeLoanPage');

const inputWorkbook = xlsx.readFile(path.join(__dirname, '../data/input.xlsx'));
const outputWorkbook = xlsx.utils.book_new();

function writeResults(sheetName, data) {
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName);
  xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/homeloanoutput.xlsx'));
}

// ✅ Test 1: Home Loan EMI Calculator
test('Home Loan EMI Calculator Test', async ({ page }) => {
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['HomeLoan'])[0];
  const homeLoanPage = new HomeLoanPage(page);

  await homeLoanPage.navigate();
  await homeLoanPage.fillHomeLoanDetails(input);

  const tenureYears = parseInt(input['Loan Tenure (Years)']);
  const results = await homeLoanPage.extractYearlyBreakup(tenureYears + 1);
  writeResults('HomeLoan', results);
  //console.log(results);
});

// ✅ Test 2: Total Interest Visibility
test('Home Loan - Total Interest Check', async ({ page }) => {
  const homeLoanPage = new HomeLoanPage(page);
  await homeLoanPage.navigate();
  await homeLoanPage.fillHomeLoanDetails({
    'Home Value': 2500000,
    'Down Payment (%)': 20,
    'Loan Insurance': 0,
    'Loan Amount': 2000000,
    'Interest Rate': 9,
    'Loan Tenure (Years)': 3,
    'Loan Fees (%)': 1,
    'One-time Expenses (%)': 0,
    'Property Taxes / year (%)': 0,
    'Home Insurance / year (%)': 0,
    'Maintenance Expenses / month': 0
  });
  const visible = await homeLoanPage.validateTotalInterest();
  console.log({ InterestVisible: visible });
});

// ✅ Test 3: UI Elements Visibility
test('Home Loan - UI Elements Visibility', async ({ page }) => {
  const homeLoanPage = new HomeLoanPage(page);
  await homeLoanPage.navigate();
  const ui = await homeLoanPage.checkUIElements();
  console.log(ui);
});

// ✅ Test 4: Insurance Impact
test('Home Loan - Insurance Impact', async ({ page }) => {
  const homeLoanPage = new HomeLoanPage(page);
  await homeLoanPage.navigate();
  await homeLoanPage.fillHomeLoanDetails({
    'Home Value': 2000000,
    'Down Payment (%)': 15,
    'Loan Insurance': 5000,
    'Loan Amount': 1500000,
    'Interest Rate': 8.5,
    'Loan Tenure (Years)': 2,
    'Loan Fees (%)': 1,
    'One-time Expenses (%)': 0,
    'Property Taxes / year (%)': 0,
    'Home Insurance / year (%)': 0,
    'Maintenance Expenses / month': 0
  });
  const results = await homeLoanPage.extractYearlyBreakup(3);
  writeResults('InsuranceImpact', results);
});

// ✅ Test 5: Maintenance Impact
test('Home Loan - Maintenance Impact', async ({ page }) => {
  const homeLoanPage = new HomeLoanPage(page);
  await homeLoanPage.navigate();
  await homeLoanPage.fillHomeLoanDetails({
    'Home Value': 2200000,
    'Down Payment (%)': 10,
    'Loan Insurance': 0,
    'Loan Amount': 1800000,
    'Interest Rate': 9.2,
    'Loan Tenure (Years)': 4,
    'Loan Fees (%)': 1,
    'One-time Expenses (%)': 0,
    'Property Taxes / year (%)': 0,
    'Home Insurance / year (%)': 0,
    'Maintenance Expenses / month': 1000
  });
  const results = await homeLoanPage.extractYearlyBreakup(5);
  writeResults('MaintenanceImpact', results);
});
