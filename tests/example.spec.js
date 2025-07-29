const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs').promises;
const XLSX = require('xlsx');

test('Download EMI Excel and print amortization table', async ({ page }) => {
  // Read Excel inside the test
  const filePath = path.join('data', 'input.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const input = sheetData[0];
  if (!input) {
    throw new Error('No input data found in Excel sheet.');
  }

  await page.goto('https://emicalculator.net');

  // Navigate to Home Loan EMI Calculator
  await page.click('a[title="Loan Calculators, Widgets & Rates"]');
  await page.click('text=Home Loan EMI Calculator');

  // Fill loan details safely
  await page.fill('#homeprice', (input['Home Value'] || '').toString());
  await page.fill('#downpayment', (input['Down Payment (%)'] || '').toString());
  await page.fill('#homeloaninsuranceamount', (input['Loan Insurance'] || '').toString());
  await page.fill('#homeloanamount', (input['Loan Amount'] || '').toString());
  await page.fill('#homeloaninterest', (input['Interest Rate'] || '').toString());
  await page.fill('#homeloanterm', (input['Loan Tenure (Years)'] || '').toString());
  await page.fill('#loanfees', (input['Loan Fees (%)'] || '').toString());

  // Continue with rest of your script...
});
