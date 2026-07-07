class CLMSDashboardPage {
    constructor(page) {
        this.page = page;
        
        // 🎯 DashboardFooter Locator -  "emSphere Technologies Pvt." - Validate that 
        this.emSphereFooter = this.page.getByRole('link', { name: 'emSphere Technologies Pvt.' });
    }

    /**
     * -- Validate the User Come on Dashboard page or not --
     */
    async isDashboardVisible() {
        try {
            // wait for Footer load on Dashboard -  7M waiting Duration
            await this.emSphereFooter.waitFor({ state: 'visible', timeout: 7000 });
            
            const isFooterVisible = await this.emSphereFooter.isVisible();
            const currentUrl = this.page.url();

            // validate the Footer 
            return isFooterVisible && currentUrl.includes('Dashboard');
        } catch (error) {
            return false;
        }
    }
}

module.exports = { CLMSDashboardPage };