class LoginPage {  
    constructor(page) {
        this.page = page; 
        this.emailInputSelector = page.getByRole('textbox', { name: '* Email  :' });
        this.passwordInputSelector = page.getByRole('textbox', { name: '* Password  :' });
        this.loginButtonSelector = page.getByRole('button', { name: 'Sign in' });
    }

    async loginUser(email, password) {
        await this.emailInputSelector.fill(email);
        await this.passwordInputSelector.fill(password);
        await this.loginButtonSelector.click();
    }

    async fillEmail(email) {
        await this.emailInputSelector.fill(email);
    }

    async fillPassword(password) {
        await this.passwordInputSelector.fill(password);
    }

    async clickLoginButton() {
        await this.loginButtonSelector.click();
    }

    async loginuser() {
        await this.loginUser('gautammarathe15@gmail.com', 'Password@15');
    }
}

module.exports = LoginPage;
