class SeatPage {
    constructor(page) {
        this.page = page;
        
        // Locators
        // Using the specific text you identified as the verification point
        this.termsValidationText = page.getByText('Seat layout page is for', { exact: false });
        this.termsHeading = page.getByText(/Terms & Conditions/i);
        
        // Seat and Proceed Locators
        this.specificSeat = page.locator('div[class*="Shape"][class*="red-shape"]:not(.reserved)').first();
        this.proceedButton = page.getByRole('button', { name: 'PROCEED' }).first();
    }

    /**
     * Validates that the Terms & Conditions are visible via specific text,
     * then dismisses the modal using the Enter key.
     */
    async validateTermsAndAccept() {
        try {
            // 1. Verify the locator is visible BEFORE any action
            // This ensures the Enter key is only pressed when the modal is actually there
            await this.termsValidationText.waitFor({ state: 'visible', timeout: 7000 });
            console.log("Step 1 Verified: Terms & Conditions text is confirmed visible.");

            // 2. Perform the action: Press Enter
            await this.page.keyboard.press('Enter');
            console.log("Step 2 Action: Accepted Terms via Enter key.");

            // 3. Wait for the modal to disappear to prevent click interception on the seats
            await this.termsHeading.waitFor({ state: 'hidden' });
        } catch (error) {
            console.log("Terms popup did not appear or verification failed, skipping keyboard action.");
        }
    }

    async selectFirstAvailableSeatInRowB() {
        // First handle the Terms & Conditions gatekeeper
        await this.validateTermsAndAccept();

        // Select the seat after the modal is gone
        await this.specificSeat.waitFor({ state: 'visible' });
        await this.specificSeat.click();

        // Proceed to summary
        await this.proceedButton.waitFor({ state: 'visible' });
        await this.proceedButton.click();
    }
}

module.exports = { SeatPage };