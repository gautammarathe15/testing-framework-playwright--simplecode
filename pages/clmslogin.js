const { expect } = require('@playwright/test');

class CLMSLoginPage {
    constructor(page) {
        this.page = page;
        
        // 🎯 फक्त लॉगिन पेजचे लोकेटर्स
        this.emSphereFooter = this.page.getByRole('link', { name: 'emSphere Technologies Pvt.' });
        this.usernameField = this.page.getByRole('textbox', { name: 'UserName' });
        this.passwordField = this.page.getByRole('textbox', { name: 'Password' });
        this.loginButton = this.page.getByRole('button', { name: 'Login' });
    }

    // 1. Open URL
    async openUrl() {
        console.log("🌐 Navigating to CLMS URL...");
        await this.page.goto('http://192.168.40.115/CLMS_ENT_5.5/app');
    }

    // 2. Validate Login Page
    async verifyPage() {
        try {
            await this.emSphereFooter.waitFor({ state: 'visible', timeout: 5000 });
            return await this.emSphereFooter.isVisible();
        } catch (error) {
            return false;
        }
    }

    // 3. Login Action
    async login(username, password) {
        await this.usernameField.fill(username || '');
        await this.passwordField.fill(password || '');
        await this.loginButton.click();
        console.log("🚀 Login button clicked!");
    }
}

module.exports = { CLMSLoginPage };