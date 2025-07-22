class HomeLoanPage {
  constructor(page) {
    this.page = page;
    this.loanAmountInput = '#homeloanamount';
    this.interestRateInput = '#homeloaninterest';
    this.tenureInput = '#homeloanterm';
  }

  async navigate() {
    await this.page.goto('https://emicalculator.net');
    await this.page.click('a[title="Loan Calculators, Widgets & Rates"]');
    await this.page.click('text=Home Loan EMI Calculator');
  }

  async fillHomeLoanDetails(input) {
    if (input['Home Value']) await this.page.fill('#homeprice', input['Home Value'].toString());
    if (input['Down Payment (%)']) await this.page.fill('#downpayment', input['Down Payment (%)'].toString());
    if (input['Loan Insurance']) await this.page.fill('#homeloaninsuranceamount', input['Loan Insurance'].toString());
    if (input['Loan Amount']) await this.page.fill('#homeloanamount', input['Loan Amount'].toString());
    if (input['Interest Rate']) await this.page.fill('#homeloaninterest', input['Interest Rate'].toString());
    if (input['Loan Tenure (Years)']) await this.page.fill('#homeloanterm', input['Loan Tenure (Years)'].toString());
    if (input['Loan Fees (%)']) await this.page.fill('#loanfees', input['Loan Fees (%)'].toString());
    if (input['One-time Expenses (%)']) await this.page.fill("//input[@id='onetimeexpenses']", input['One-time Expenses (%)'].toString());
    if (input['Property Taxes / year (%)']) await this.page.fill("//input[@id='propertytaxes']", input['Property Taxes / year (%)'].toString());
    if (input['Home Insurance / year (%)']) await this.page.fill("//input[@id='homeinsurance']", input['Home Insurance / year (%)'].toString());
    if (input['Maintenance Expenses / month']) await this.page.fill("//input[@id='maintenanceexpenses']", input['Maintenance Expenses / month'].toString());

    await this.page.click("//h3[@id='exp']");
  }

  async extractYearlyBreakup(expectedRows) {
    const rows = await this.page.locator('.yearlypaymentdetails');
    const count = await rows.count();

    const columnNames = [
      "Year",
      "Principal (A)",
      "Interest (B)",
      "Taxes, Home Insurance & Maintenance (C)",
      "Total Payment (A+B+C)",
      "Balance",
      "Loan Paid to Date"
    ];

    const results = [];

    for (let i = 0; i < Math.min(count, expectedRows); i++) {
      const row = rows.nth(i);
      const cells = await row.locator('td').allTextContents();
      const rowData = {};

      for (let j = 0; j < columnNames.length; j++) {
        rowData[columnNames[j]] = cells[j]?.trim() || '';
      }

      results.push(rowData);
    }

    return results;
  }

  async validateTotalInterest() {
    //await this.page.waitForSelector('#emitotalinterest');
    return await this.page.locator('#emitotalinterest').isVisible();
  }

  async checkUIElements() {
    return {
      loanAmountVisible: await this.page.locator(this.loanAmountInput).isVisible(),
      interestRateVisible: await this.page.locator(this.interestRateInput).isVisible(),
      tenureVisible: await this.page.locator(this.tenureInput).isVisible()
    };
  }
}

module.exports = { HomeLoanPage };
