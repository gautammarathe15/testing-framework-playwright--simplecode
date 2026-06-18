const { test } = require('@playwright/test');
const { TshirtHomePage } = require('../pages/tshirtHomePage');
const { ProductDetailsPage } = require('../pages/productDetailsPage');

test('Cheapest Tshirt Flow Validation', async ({ page }) => {
    const tshirtHome = new TshirtHomePage(page);
    const productDetails = new ProductDetailsPage(page);

    // 1) Launch URL
    await page.goto('https://automationexercise.com/');

    await page.pause();

    // 2) Select Men > Tshirt
    await tshirtHome.selectTshirtCategory();

    // 3) Select Lowest Price and Click View Product
    await tshirtHome.clickViewProductOnCheapestItem();

    // 4) Check Availability & Condition, then click add to cart
    await productDetails.verifyAndAdd();

    // 5) Validate popup
    await productDetails.validatePopup();
});