/**
 * --------------------------------------------------------------------------
 * CLMS Login Page Object Class
 * File: pages/clmslogin.js
 * --------------------------------------------------------------------------
 */

const { expect } = require('@playwright/test');

class CLMSLoginPage {
    constructor(page) {
        this.page = page;
        
        // Base Login Page Locators
        this.emSphereFooter = this.page.getByRole('link', { name: 'emSphere Technologies Pvt.' });
        
        // Main login input fields and button locators with fallback selectors
        this.usernameField = this.page.locator('#txtUsername, input[name="username"], input[name="Username"], input[type="text"]').first();
        this.passwordField = this.page.locator('#txtPassword, input[name="password"], input[name="Password"], input[type="password"]').first();
        this.loginButton = this.page.locator('#btnLogin, input[value="Login"], button:has-text("Login")').first();
        
        // 🎯 Red Text & Authentication Error Locator (Exact UI elements matching the screenshot)
        this.errorMessage = this.page.locator('font[color="red"], font[color="Red"], span[style*="color:Red"], span[style*="color: red"]')
            .or(this.page.locator('text="Invalid Username or Password"'))
            .or(this.page.locator('#lblError, #lblMessage, .alert-danger, .error-message, #divError'))
            .first();

        // Forgot Password Pop-up Locators
        this.forgetPasswordLink = this.page.getByRole('link', { name: 'Forgot Password' });
        
        // Locators for modal/pop-up input fields
        this.forgotUsernameField = this.page.locator('.modal-body input[type="text"], #divForgotPassword input[type="text"], input[id*="Forgot"], input[name*="Forgot"], .popup input[type="text"], #txtForgotUsername').first();
        this.forgotCaptchaImage = this.page.getByRole('img', { name: 'Captcha' });
        this.forgotCaptchaInput = this.page.locator('.modal-body input[type="text"], input[id*="Captcha"], input[name*="Captcha"], #txtCaptcha').nth(1);
        this.forgotSubmitButton = this.page.locator('input[value="Send Password To Email Id"], button:has-text("Send"), #btnSendPassword').first();
        
        // Pop-up Close Locators
        this.forgotCloseIconX = this.page.locator('.modal-header .close, button.close, [aria-label="Close"], .ui-dialog-titlebar-close').first();
        this.forgotCloseButtonBtn = this.page.locator('input[value="Close"], button:has-text("Close"), .modal-footer button:has-text("Close")').first();
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

    // Main method for automated login loop
    async login(username, password) {
        await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
        await this.usernameField.fill(username || '');
        await this.passwordField.fill(password || '');
        await this.loginButton.click();
    }

    // Cucumber step definition actions
    async enterUsername(username) {
        await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
        await this.usernameField.fill(username !== undefined ? username : '');
    }

    async enterPassword(password) {
        await this.passwordField.fill(password !== undefined ? password : '');
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async verifyUsernameFieldVisible() {
        await expect(this.usernameField).toBeVisible();
        await expect(this.usernameField).toBeEditable();
    }

    async verifyPasswordFieldVisible() {
        await expect(this.passwordField).toBeVisible();
        await expect(this.passwordField).toBeEditable();
    }

    // Error Message Validation Method (Targeting Red Error Text)
    async verifyErrorMessage(expectedErrorMessage) {
        console.log("🔍 Verifying red authentication error message on UI...");
        
        // Extended wait time to ensure backend response renders on UI
        await this.errorMessage.waitFor({ state: 'visible', timeout: 15000 });
        await expect(this.errorMessage).toBeVisible();

        if (expectedErrorMessage) {
            await expect(this.errorMessage).toContainText(expectedErrorMessage);
        }
        console.log("✅ Red error message verified successfully.");
    }

    async verifyFieldValidationErrors() {
        const validationError = this.page.locator('.field-validation-error, .invalid-feedback, #lblError, font[color="red"]').first();
        await validationError.waitFor({ state: 'visible', timeout: 10000 });
        await expect(validationError).toBeVisible();
    }

    // Forgot Password Validations
    async clickForgetPasswordLink() {
        await this.forgetPasswordLink.waitFor({ state: 'visible', timeout: 5000 });
        await this.forgetPasswordLink.click();
        console.log("👆 Clicked on Forgot Password link.");
    }

    async verifyForgotFieldsAreVisible() {
        console.log("🔍 Verifying fields on Forgot Password Pop-up...");
        await this.forgotUsernameField.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.forgotUsernameField).toBeVisible();
        console.log("👀 UI Verification: Pop-up fields are fully visible.");
    }

    async verifyAndClickCloseIconX() {
        console.log("🔍 Checking 🗙 Icon...");
        await this.forgotCloseIconX.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.forgotCloseIconX).toBeVisible();
        
        await this.forgotCloseIconX.click();
        console.log("👆 Clicked on 🗙 Icon.");

        await expect(this.forgotUsernameField).toBeHidden({ timeout: 5000 });
        await expect(this.usernameField).toBeVisible();
    }

    async verifyAndClickCloseButton() {
        console.log("🔍 Checking 'Close' Button...");
        await this.forgotCloseButtonBtn.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.forgotCloseButtonBtn).toBeVisible();

        await this.forgotCloseButtonBtn.click();
        console.log("👆 Clicked on 'Close' button.");

        await expect(this.forgotUsernameField).toBeHidden({ timeout: 5000 });
        await expect(this.usernameField).toBeVisible();
    }
}

module.exports = { CLMSLoginPage };