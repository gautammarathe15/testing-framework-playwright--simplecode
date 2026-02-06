const {expect } = require("@playwright/test");

class Homepage {
    constructor(page) 
    {
        this.page = page;
         this.origin = "locator('#rc_select_0')"
         this.destination = "locator('#rc_select_1')"
         this.datePicker = page.getByRole('textbox', { name: 'Onward' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }

    async selectOrigin(originCity) {
        await this.page.locator('#rc_select_0').click();
        await this.page.locator('#rc_select_0').fill(originCity);
        // In the mock server, the options are always present in the DOM
        const option = this.page.locator(`.rc-virtual-list-holder-inner div`).filter({ hasText: new RegExp(`^${originCity}$`) }).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
    }

    async selectDestination(destinationCity) {
        await this.page.locator('#rc_select_1').click();
        await this.page.locator('#rc_select_1').fill(destinationCity);
        const option = this.page.locator(`.rc-virtual-list-holder-inner div`).filter({ hasText: new RegExp(`^${destinationCity}$`) }).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
    }

    async selectDate() {
        // Click the date picker to open calendar
        await this.datePicker.click();
        await this.page.waitForTimeout(500);
        
        // In this mock, we just click the input again to "select" tomorrow
        await this.datePicker.click();
    }

    async clickSearchButton() {
        await this.searchButton.click();  
    }
}
module.exports = Homepage;
