const { test } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');

// Import Page Objects
const { CarLoanPage } = require('../pages/CarLoanPage');
// Load input Excel
const inputWorkbook = xlsx.readFile(path.join(__dirname, '../data/input.xlsx'));
const outputWorkbook = xlsx.utils.book_new();

// Utility to write results to output Excel
function writeResults(sheetName, data) {
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName);
  xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/caroutput.xlsx'));
}

// ✅ Test 1: Car Loan Calculator - First Month Breakdown
test('Car Loan Calculator - First Month Breakdown', async ({ page }) => {
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['CarLoan'])[0];
  const carLoanPage = new CarLoanPage(page);

  await carLoanPage.navigate();
  await carLoanPage.fillLoanDetails({
    loanAmount: input['Loan Amount'],
    interestRate: input['Interest Rate'],
    tenure: input['Loan Tenure (Years)']
  });

  const firstMonthData = await carLoanPage.getFirstMonthBreakup();
  writeResults('CarLoan', [firstMonthData]);
});


//Test Case 2
test('Car Loan - EMI Calculation Check', async ({ page }) => {
    const carLoanPage = new CarLoanPage(page);
    await carLoanPage.navigate();
    await carLoanPage.fillLoanDetails({ loanAmount: 1000000, interestRate: 8.5, tenure: 2 });
    const visible = await carLoanPage.validateEMICalculation();
    console.log({ EMIVisible: visible });
  });
   
   
  //Test Case 3
  test('Car Loan - UI Elements Visibility', async ({ page }) => {
    const carLoanPage = new CarLoanPage(page);
    await carLoanPage.navigate();
    const ui = await carLoanPage.checkUIElements();
    console.log(ui);
  });
   

   //Test Case 4
test('Car Loan - Different Tenure', async ({ page }) => {
    const carLoanPage = new CarLoanPage(page);
    await carLoanPage.navigate();
    await carLoanPage.fillLoanDetails({ loanAmount: 500000, interestRate: 7.5, tenure: 5 });
    const result = await carLoanPage.getFirstMonthBreakup();
    console.log(result);
  });


  //Test Case 5
  test('Car Loan - Edge Case Input', async ({ page }) => {
    const carLoanPage = new CarLoanPage(page);
    await carLoanPage.navigate();
    await carLoanPage.fillLoanDetails({ loanAmount: 1, interestRate: 0.1, tenure: 1 });
    const result = await carLoanPage.getFirstMonthBreakup();
    console.log(result);
  });
   
   




// ✅ Save output after all tests
 /*test.afterAll(() => {
   xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/output.xlsx'));
});*/
