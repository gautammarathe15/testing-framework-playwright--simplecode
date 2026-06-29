class ContractorEmployeePage {
    constructor(page) {
        this.page = page;
        
        // Locators representing core elements for navigation and verification
        this.masterMenuLink = this.page.getByRole('link', { name: 'Masters' });
        
        // Handles generic sidebar toggle buttons across different layout states
        this.menuToggleBtn = this.page.locator('.navbar-toggle, #menuToggleBtn, [title="Toggle navigation"]').first(); 
        
        // Target option link to be validated
        this.contractorEmployeeLink = this.page.getByRole('link', { name: 'Contractor Employee' });
    }

    /**
     * Core validation logic to verify if the "Contractor Employee" option is visible on screen.
     * Reused across multiple navigation workflows to prevent code duplication.
     * @returns {Promise<boolean>}
     */
    async verifyVisibility() {
        try {
            // Wait for the element to stabilize and appear in the DOM
            await this.contractorEmployeeLink.waitFor({ state: 'visible', timeout: 4000 });
            return await this.contractorEmployeeLink.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Method 1: Directly click the top-level 'Masters' menu item and verify target visibility.
     * @returns {Promise<boolean>}
     */
    async validateViaMasterMenu() {
        console.log("🔍 [Method 1] Clicking on 'Masters' menu...");
        await this.masterMenuLink.waitFor({ state: 'visible', timeout: 3000 });
        await this.masterMenuLink.click();
        
        // Reusability: Delegate check to the core validation function
        return await this.verifyVisibility(); 
    }

    /**
     * Method 2: Check visibility directly on the Dashboard landing view (e.g., via shortcut cards).
     * @returns {Promise<boolean>}
     */
    async validateDirectOnDashboard() {
        console.log("🔍 [Method 2] Checking directly on Dashboard view...");
        
        // Reusability: Directly check visibility without trigger interactions
        return await this.verifyVisibility();
    }

    /**
     * Method 3: Expand the structural sidebar via toggle button first, then proceed to Masters.
     * @returns {Promise<boolean>}
     */
    async validateViaMenuToggle() {
        console.log("🔍 [Method 3] Triggering responsive Menu Toggle Button...");
        await this.menuToggleBtn.click();

        console.log("🔍 Clicking on 'Masters' inside expanded toggle menu...");
        await this.masterMenuLink.waitFor({ state: 'visible', timeout: 3000 });
        await this.masterMenuLink.click();

        // Reusability: Verify element state after completing layout sequence
        return await this.verifyVisibility();
    }
}

module.exports = { ContractorEmployeePage };