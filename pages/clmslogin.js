const { expect } = require('@playwright/test');

class CLMSLoginPage {
    constructor(page) {
        this.page = page;
        
        // 🔹 Base Login Page Locators
        this.emSphereFooter = this.page.getByRole('link', { name: 'emSphere Technologies Pvt.' });
        this.usernameField = this.page.getByRole('textbox', { name: 'UserName' });
        this.passwordField = this.page.getByRole('textbox', { name: 'Password' });
        this.loginButton = this.page.getByRole('button', { name: 'Login' });

        // 🎯 Forgot Password Pop-up Locators
        this.forgetPasswordLink = this.page.getByRole('link', { name: 'Forgot Password' });
        this.forgotUsernameField = this.page.getByRole('textbox', { name: 'User Name' });
        this.forgotCaptchaImage = this.page.getByRole('img', { name: 'Captcha' });
        this.forgotCaptchaInput = this.page.getByRole('textbox', { name: 'Enter Captcha' });
        this.forgotSubmitButton = this.page.getByRole('button', { name: 'Send Password To Email Id' });
        
        // 🎯 Seperate Close Locators
        this.forgotCloseIconX = this.page.getByLabel('Close'); // 🗙 Icon 
        this.forgotCloseButtonBtn = this.page.locator('input[value="Close"]'); // Bottom Blue Close Button
    }

    async openUrl() {
        console.log("🌐 Navigating to CLMS URL...");
        await this.page.goto('http://192.168.40.115/CLMS_ENT_5.5/app');
    }

    async verifyPage() {
        try {
            await this.emSphereFooter.waitFor({ state: 'visible', timeout: 5000 });
            return await this.emSphereFooter.isVisible();
        } catch (error) {
            return false;
        }
    }

    // 🎯 Automated Login Loop साठी मुख्य मेथड
    async login(username, password) {
        await this.usernameField.fill(username || '');
        await this.passwordField.fill(password || '');
        await this.loginButton.click();
    }

    async clickForgetPasswordLink() {
        await this.forgetPasswordLink.waitFor({ state: 'visible', timeout: 5000 });
        await this.forgetPasswordLink.click();
        console.log("👆 Clicked on Forgot Password link.");
    }

    async verifyForgotFieldsAreVisible() {
        console.log("🔍 Verifying fields on Forgot Password Pop-up...");
        await this.forgotUsernameField.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.forgotUsernameField).toBeVisible();
        console.log("👀 UI Verification: Pop-up fields are fully visible.");
    }

    // 🎯 🗙 Icon साठी स्वतंत्र व्हॅलिडेशन
    async verifyAndClickCloseIconX() {
        console.log("🔍 Checking 🗙 Icon (getByLabel)...");
        await this.forgotCloseIconX.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.forgotCloseIconX).toBeVisible();
        
        await this.forgotCloseIconX.click();
        console.log("👆 Clicked on 🗙 Icon.");

        await expect(this.forgotUsernameField).toBeHidden({ timeout: 5000 });
        await expect(this.usernameField).toBeVisible();
    }

    // 🎯 Close Button साठी स्वतंत्र व्हॅलिडेशन
    async verifyAndClickCloseButton() {
        console.log("🔍 Checking 'Close' Button (getByText/Value)...");
        await this.forgotCloseButtonBtn.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.forgotCloseButtonBtn).toBeVisible();

        await this.forgotCloseButtonBtn.click();
        console.log("👆 Clicked on 'Close' button.");

        await expect(this.forgotUsernameField).toBeHidden({ timeout: 5000 });
        await expect(this.usernameField).toBeVisible();
    }
}
    
module.exports = { CLMSLoginPage };