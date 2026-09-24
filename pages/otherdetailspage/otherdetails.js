const { expect } = require('@playwright/test');

class OtherDetailsPage {
    constructor(page) {
        this.page = page;
        this.locators = {
            "Aadhaar Card No": 'input#CWContractorEmployeeAadhaarCheck_AadhaarNo',
            "Verify Aadhaar Link": 'div#divAadhaarCardVerifyAction a',
            "Upload Aadhaar File": 'input#AadhardocumentFile',
            "PAN No": 'input#EmployeeOtherDetail_PanNo',
            "Upload PAN File": 'input#PANDocumentFile',
            "ESIC No": 'input#EmployeeOtherDetail_ESINo',
            "Passport No": 'input#EmployeeOtherDetail_PassportNo',
            "Passport Expiration Date": 'input#EmployeeOtherDetail_PassportExpirationDate',
            "PF No": 'input#EmployeeOtherDetail_PFNo',
            "UAN": 'input#EmployeeOtherDetail_UAN',
            "Work Permit No": 'input#EmployeeOtherDetail_WorkPermitNo',
            "Work Permit Exp. Date": 'input#EmployeeOtherDetail_WorkPermitExpDate',
            "WC Policy Number": 'input#EmployeeOtherDetail_WcPolicyNo',
            "Election Card No": 'input#EmployeeOtherDetail_ElectionCardNo',
            "Labour Card No": 'input#EmployeeOtherDetail_LabourCardNo',
            "Labour Card Exp. Date": 'input#EmployeeOtherDetail_LabourCardExpDate',
            "Bank Dropdown": 'select#EmployeeOtherDetail_BankMasterID',
            "IFSC Code": 'input#IFSCCode',
            "Branch Name": 'input#EmployeeOtherDetail_BankBranchName',
            "Bank Account No": 'input#EmployeeOtherDetail_BankAccountNo'
        };
    }

    async clickOtherDetailsTab() {
        const tabElement = this.page.getByText('Other Detail', { exact: false }).first();
        await tabElement.click();
    }

    async verifyAllElementsAndCollectData() {
        let reportData = [];

        for (const [name, selector] of Object.entries(this.locators)) {
            const element = this.page.locator(selector).first();
            let isVisible = false;
            let currentValue = "";

            try {
                isVisible = await element.isVisible({ timeout: 2000 });
                if (isVisible) {
                    currentValue = await element.inputValue().catch(() => "");
                    
                    const tagName = await element.evaluate(node => node.tagName.toLowerCase()).catch(() => '');
                    if (tagName === 'select') {
                        currentValue = await element.evaluate(node => node.options[node.selectedIndex]?.text || "").catch(() => "Selected Option");
                    }
                }
            } catch (e) {
                isVisible = false;
            }

            reportData.push({
                optionName: name,
                status: isVisible ? "Visible" : "Not Visible",
                currentDetails: currentValue ? currentValue : "Empty / N/A"
            });
        }

        return reportData;
    }
}

function getOtherDetailsPage(page) {
    return new OtherDetailsPage(page);
}

module.exports = { OtherDetailsPage, getOtherDetailsPage };