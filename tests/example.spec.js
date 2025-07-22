const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs').promises;
const XLSX = require('xlsx');

test('Download EMI Excel and print amortization table', async ({ page }) => {
  await page.goto('https://emicalculator.net');

  // Navigate to Home Loan EMI Calculator
  await page.click('a[title="Loan Calculators, Widgets & Rates"]');
  await page.click('text=Home Loan EMI Calculator');

  // Fill loan details
  await page.fill('#homeprice', '5000000');
  await page.fill('#downpayment', '20');
  await page.fill('#homeloaninsuranceamount', '50000');
  await page.fill('#homeloanamount', '4800000');
  await page.fill('#homeloaninterest', '7.2');
  await page.fill('#homeloanterm', '15');
  await page.fill('#loanfees', '0.5');

  // Trigger the calculator update
  await page.click('body > div > div > main > article > div.calculatorcontainer > div > div:nth-child(4)');

  // Allow time for results to render
  await page.waitForTimeout(2000);

  // Define column headers
  const columnNames = [
    "Year",
    "Principal(A)",
    "Interest(B)",
    "Taxes, Home Insurance & Maintenance(C)",
    "Total Payment(A+B+C)",
    "Balance",
    "Loan Paid to Date"
  ];

  const data = [columnNames]; // First row: headers

  // Extract all rows of amortization table
  const rows = await page.$$(".yearlypaymentdetails");
  console.log(`Found ${rows.length} rows`);

  for (const row of rows) {
    const cells = await row.$$("td");
    const rowData = [];
    for (const cell of cells) {
      const text = await cell.textContent();
      rowData.push(text.trim());
    }
    data.push(rowData); // Add row to dataset
  }

  // Create Excel worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'amortization.xlsx');

  // Ensure output folder exists and write file
  await fs.mkdir('data', { recursive: true });
  XLSX.writeFile(workbook, path.join('data', 'amortization.xlsx'));

  console.log('\n Excel file saved to data/amortization.xlsx');
});
