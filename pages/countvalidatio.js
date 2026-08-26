class ContractorEmployeeCombinedPage {
  constructor(page) {
    this.page = page;
    this.activeCountHeader = page.locator('#spnActiveRecordCount');
    this.totalCountHeader = page.locator('#spnTopRecordCount');
    this.createBtn = page.locator('#btnCreate');
    this.aadhaarInput = page.locator('#txtAadharCardNo');
    this.uploadInput = page.locator('#fileExcelUpload');
  }

  // 12-Digit Dynamic Aadhaar Generator
  generateDynamicAadhaar() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  }

  // Active आणि Total Live Count घेणे
  async getLiveCounts() {
    await this.activeCountHeader.waitFor({ state: 'visible' });
    const activeText = await this.activeCountHeader.innerText();
    const totalText = await this.totalCountHeader.innerText();

    return {
      active: parseInt(activeText.trim(), 10),
      total: parseInt(totalText.trim(), 10)
    };
  }
}

module.exports = { ContractorEmployeeCombinedPage };