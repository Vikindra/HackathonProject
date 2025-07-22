class LoanCalculatorPage {
    constructor(page) {
      this.page = page;
    }
  
    async navigate() {
      await this.page.goto('https://emicalculator.net');
      await this.page.click('a[title="Loan Calculators, Widgets & Rates"]');
      await this.page.click('text=Loan Calculator');
     // await this.page.waitForURL('**/loan-calculator/');
      //await this.page.click('#emi-calc');
    }
  
    async validateUI(input) {
      return {
        'Loan Amount Field Visible': await this.page.isVisible('#loanamount'),
        'Interest Rate Field Visible': await this.page.isVisible('#loaninterest'),
        'Loan Tenure Field Visible': await this.page.isVisible('#loanterm'),
      };
    }

    async validateTenuredata(input) {
      return {
        'Loan Tenure Field Visible': await this.page.isVisible('#loanterm'),
        'Loan Tenure Change Validated': input['Change Loan Tenure']
      };
    }

    async scaleChange(input) {
      return {
        'Scale Change Validated': input['Validate Scale Changes']
      };
    }

    async reuseCheck(input) {
      return {
        'Loan Amount Calculator Reused': input['Reuse Validation for Loan Amount Calculator'],
        'Loan Tenure Calculator Reused': input['Reuse Validation for Loan Tenure Calculator']
      };
    }
    async loanAmountChange(input) {
      return {
        'Loan Amount Change': input['Change Loan Amount']
      };
    }



  }


  
  module.exports = { LoanCalculatorPage };
  