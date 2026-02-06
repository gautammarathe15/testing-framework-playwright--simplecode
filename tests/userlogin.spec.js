const { test, expect } = require('@playwright/test');
const LoginPage=require("../pages/loginpage");
const Homepage=require("../pages/hompage");

test('login application test', async ({ page }) => 
{
    await page.goto('https://www.eastwestbooking.net/index.html');
    await page.locator('#close').click();
    await page.getByRole('link', { name: 'Customer Login' }).click();
    await page.pause();
    const loginpage=new LoginPage(page);
    await loginpage.loginuser();
    const homepage=new Homepage(page);
    await page.pause();
    await homepage.selectOrigin('Pune');
    await homepage.selectDestination('Shimoga');
    await homepage.selectDate();
    await homepage.clickSearchButton();
});