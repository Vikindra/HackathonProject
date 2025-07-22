const { test } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');

// Import Page Objects
const { LoanCalculatorPage } = require('../pages/LoanCalculatorPage');

// Load input Excel
const inputWorkbook = xlsx.readFile(path.join(__dirname, '../data/input.xlsx'));
const outputWorkbook = xlsx.utils.book_new();

// Utility to write results to output Excel
function writeResults(sheetName, data) {
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName);
  xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/loancalcoutput.xlsx'));
}


// ✅ Test 3: Loan Calculator UI Validation
test('Loan Calculator UI Validation', async ({ page }) => {
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
  const loanCalcPage = new LoanCalculatorPage(page);

  await loanCalcPage.navigate();
  const results = [await loanCalcPage.validateUI(input)];
  writeResults('LoanCalculator', results);

});
// test case 2
test('Tenure data Validation', async ({ page }) => {
    const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
    const loanCalcPage = new LoanCalculatorPage(page);
  
    await loanCalcPage.navigate();
    const results = [await loanCalcPage.validateTenuredata(input)];
   // writeResults('LoanCalculator', results);
   console.log(results);
  
  });
  // test case 3
  test('Check Scale Change', async ({ page }) => {
    const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
    const loanCalcPage = new LoanCalculatorPage(page);
  
    await loanCalcPage.navigate();
    const results = [await loanCalcPage.scaleChange(input)];
    //writeResults('LoanCalculator', results);
    console.log(results);
  
  });
// test case 4
test('Check Reuse Validation', async ({ page }) => {
    const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
    const loanCalcPage = new LoanCalculatorPage(page);
  
    await loanCalcPage.navigate();
    const results = [await loanCalcPage.reuseCheck(input)];
    console.log(results);
    //writeResults('LoanCalculator', results);
  
  });
// test case 5
test('Check Loan Amount Change', async ({ page }) => {
    const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['LoanCalculator'])[0];
    const loanCalcPage = new LoanCalculatorPage(page);
  
    await loanCalcPage.navigate();
    const results = [await loanCalcPage.loanAmountChange(input)];
    //writeResults('LoanCalculator', results);
    console.log(results);
  
  });
  
  /*test.afterEach(() => {
     xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/loancalcoutput.xlsx'));
  });*/
