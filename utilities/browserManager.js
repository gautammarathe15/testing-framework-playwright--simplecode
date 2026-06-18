const { chromium } = require('playwright');
const path = require('path');

class BrowserManager {
  static browser = null;
  static context = null;
  static page = null;

  static async launchBrowser() {
    this.browser = await chromium.launch({
      headless: false, // Set to true for headless mode
      args: [       '--deny-permission-prompts',       '--start-maximized']
 
    });

    this.context = await this.browser.newContext({
      viewport: null
    });

    // Set default timeout to 60 seconds for all actions
    this.context.setDefaultTimeout(120000);
    //this.context.setDefaultNavigationTimeout(120000);

    this.page = await this.context.newPage();
    return this.page;
  }

  static getPage() {
    return this.page;
  }

  static async closeBrowser() {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = BrowserManager;
