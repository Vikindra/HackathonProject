class CarLoanPage {
    constructor(page) {
      this.page = page;
      this.loanTab = '#car-loan';
      this.loanAmountInput = '#loanamount';
      this.interestRateInput = '#loaninterest';
      this.loanTenureInput = '#loanterm';
      this.triggerArea = "//label[@for='emischeme']";
      this.clickYear = '//*[@id="year2025"]';
      this.amortizationTable = '#emibreakup tbody tr';
    }
  
    async navigate() {
      await this.page.goto('https://emicalculator.net');
      await this.page.click(this.loanTab);
    }
  
    async fillLoanDetails({ loanAmount, interestRate, tenure }) {
      await this.page.fill(this.loanAmountInput, loanAmount.toString());
      await this.page.fill(this.interestRateInput, interestRate.toString());
      await this.page.fill(this.loanTenureInput, tenure.toString());
      await this.page.click(this.triggerArea); // Trigger calculation
    }
  
    async getFirstMonthBreakup() {
        // Wait for the table container to appear first
        //await this.page.waitForSelector('//*[@id="year2025"]', { timeout: 50000 });
        await this.page.click(this.clickYear);


      
        // Wait for at least one row to appear
       // await this.page.waitForSelector('//*[@id="year2025"] tbody tr', { timeout: 50000 });
      
       //const firstRow = this.page.locator('//*[@id="year2025"]/tbody/tr').first();
       //const firstRow = this.page.locator('#year2025').first();

      return {
          Month: await this.page.locator("//td[normalize-space()='Jul']").first().textContent(),
          Principal: await this.page.locator('//*[@id="monthyear2025"]/td/div/table/tbody/tr[1]/td[2]').textContent(),
          Interest: await this.page.locator('//*[@id="monthyear2025"]/td/div/table/tbody/tr[1]/td[3]').textContent()
      };
      }

      async validateEMICalculation() {
        await this.page.waitForSelector('#emitotalamount');
        return await this.page.locator('#emitotalamount').isVisible();
      }
     
      async checkUIElements() {
        return {
          loanAmountVisible: await this.page.locator(this.loanAmountInput).isVisible(),
          interestRateVisible: await this.page.locator(this.interestRateInput).isVisible(),
          tenureVisible: await this.page.locator(this.loanTenureInput).isVisible()
        };
      }
      


      
  }
  
  module.exports = { CarLoanPage };
  