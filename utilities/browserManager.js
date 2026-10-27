const { chromium, firefox, webkit } = require('@playwright/test');

class BrowserManager {
  static browser = null;
  static context = null;
  static page = null;

  static async launchBrowser(browserType = process.env.BROWSER || 'chromium', headless = process.env.HEADLESS === 'true') {
    const selectedBrowser = (browserType || 'chromium').toLowerCase();

    const browserMap = {
      chromium: { launcher: chromium, options: { headless, channel: 'chrome' } },
      chrome: { launcher: chromium, options: { headless, channel: 'chrome' } },
      firefox: { launcher: firefox, options: { headless } },
      webkit: { launcher: webkit, options: { headless } },
      all: { launcher: chromium, options: { headless, channel: 'chrome' } } // kept for compatibility; config handles all-browser runs
    };

    const browserConfig = browserMap[selectedBrowser] || browserMap.chromium;

    this.browser = await browserConfig.launcher.launch({
      ...browserConfig.options,
      args: ['--deny-permission-prompts', '--start-maximized']
    });

    this.context = await this.browser.newContext({
      viewport: null,
      baseURL: process.env.BASE_URL || 'http://192.168.40.115/CLMS_ENT_5.5/app'
    });

    this.context.setDefaultTimeout(120000);
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
