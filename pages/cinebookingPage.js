class BookingPage {
    constructor(page) {
        this.page = page;
        
        // Locators
        this.dateDropdown = page.getByRole('combobox', { name: 'Select Date' });
        this.timeDropdown = page.getByRole('combobox', { name: 'Select Time' });
        this.quickBookButton = page.getByRole('button', { name: 'Quick Book' });
        
        // FIX: Moved inside constructor and used Regex for the failure in {545B42EE-D60B-4F7C-8C82-06C42B02996D}.png
        this.summaryHeading = page.getByText(/Booking Summary/i);
    }

    async selectDateAndTime() {
        // 1. Open the date dropdown
        await this.dateDropdown.click();

        // 2. Date Logic
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const todayFullDate = `${day}/${month}/${year}`;

        // 3. Selection Logic
        const todayOption = this.page.getByText(todayFullDate).first();
        const firstAvailableOption = this.page.locator('ul[role="listbox"] li').first();

        if (await todayOption.isVisible()) {
            await todayOption.click();
        } else {
            await firstAvailableOption.click();
            console.log("Selecting first available date.");
        }

        // 4. Time Selection
        await this.timeDropdown.click();
        const firstTimeSlot = this.page.locator('ul[role="listbox"] li').first();
        
        await firstTimeSlot.waitFor({ state: 'visible' });
        await firstTimeSlot.click();
        
        // 5. Click Quick Book
        await this.quickBookButton.click();
        
        // Ensure navigation starts after clicking Quick Book
    
    }
}

module.exports = { BookingPage };