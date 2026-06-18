/**
 * Base Page Object Class
 * Contains common methods for all page objects
 */

class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   */
  async navigate(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on an element
   * @param {string} selector - CSS selector
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Fill text in an input field
   * @param {string} selector - CSS selector
   * @param {string} text - Text to fill
   */
  async fill(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Get text content of an element
   * @param {string} selector - CSS selector
   * @returns {Promise<string>}
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Check if element is visible
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>}
   */
  async isVisible(selector) {
    try {
      return await this.page.locator(selector).isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in ms
   */
  async waitForElement(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Get count of elements matching selector
   * @param {string} selector - CSS selector
   * @returns {Promise<number>}
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Take screenshot
   * @param {string} filename - Filename for screenshot
   */
  async takeScreenshot(filename) {
    await this.page.screenshot({ path: `screenshots/${filename}`, fullPage: true });
  }

  /**
   * Get current URL
   * @returns {Promise<string>}
   */
  async getCurrentURL() {
    return this.page.url();
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Scroll to element
   * @param {string} selector - CSS selector
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Wait for navigation
   * @param {number} timeout - Timeout in ms
   */
  async waitForNavigation(timeout = 30000) {
    await this.page.waitForNavigation({ timeout });
  }

  /**
   * Reload page
   */
  async reloadPage() {
    await this.page.reload();
  }

  /**
   * Go back to previous page
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Go forward to next page
   */
  async goForward() {
    await this.page.goForward();
  }

  /**
   * Clear input field
   * @param {string} selector - CSS selector
   */
  async clearInput(selector) {
    await this.page.fill(selector, '');
  }

  /**
   * Get attribute value
   * @param {string} selector - CSS selector
   * @param {string} attribute - Attribute name
   * @returns {Promise<string>}
   */
  async getAttribute(selector, attribute) {
    return await this.page.getAttribute(selector, attribute);
  }

  /**
   * Check if element is enabled
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>}
   */
  async isEnabled(selector) {
    return await this.page.isEnabled(selector);
  }

  /**
   * Check if element is disabled
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>}
   */
  async isDisabled(selector) {
    return !(await this.isEnabled(selector));
  }

  /**
   * Hover over element
   * @param {string} selector - CSS selector
   */
  async hover(selector) {
    await this.page.hover(selector);
  }

  /**
   * Get input value
   * @param {string} selector - CSS selector
   * @returns {Promise<string>}
   */
  async getInputValue(selector) {
    return await this.page.inputValue(selector);
  }

  /**
   * Select option from dropdown
   * @param {string} selector - CSS selector
   * @param {string} value - Option value
   */
  async selectOption(selector, value) {
    await this.page.selectOption(selector, value);
  }

  /**
   * Press key
   * @param {string} key - Key to press
   */
  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text character by character
   * @param {string} text - Text to type
   * @param {number} delay - Delay between keystrokes
   */
  async typeText(text, delay = 100) {
    await this.page.keyboard.type(text, { delay });
  }

  /**
   * Wait for timeout
   * @param {number} ms - Milliseconds to wait
   */
  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Evaluate JavaScript on page
   * @param {string} script - JavaScript code
   * @returns {Promise<*>}
   */
  async evaluateScript(script) {
    return await this.page.evaluate(script);
  }

  /**
   * Get all text content from elements
   * @param {string} selector - CSS selector
   * @returns {Promise<Array>}
   */
  async getAllText(selector) {
    return await this.page.locator(selector).allTextContents();
  }

  /**
   * Check if URL contains string
   * @param {string} str - String to check
   * @returns {Promise<boolean>}
   */
  async urlContains(str) {
    const url = await this.getCurrentURL();
    return url.includes(str);
  }

  /**
   * Double click on element
   * @param {string} selector - CSS selector
   */
  async doubleClick(selector) {
    await this.page.dblclick(selector);
  }

  /**
   * Right click on element
   * @param {string} selector - CSS selector
   */
  async rightClick(selector) {
    await this.page.click(selector, { button: 'right' });
  }

  /**
   * Check all checkboxes
   * @param {string} selector - CSS selector of checkboxes
   */
  async checkAllCheckboxes(selector) {
    const count = await this.getElementCount(selector);
    for (let i = 0; i < count; i++) {
      const checkbox = this.page.locator(selector).nth(i);
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }
  }

  /**
   * Uncheck all checkboxes
   * @param {string} selector - CSS selector of checkboxes
   */
  async uncheckAllCheckboxes(selector) {
    const count = await this.getElementCount(selector);
    for (let i = 0; i < count; i++) {
      const checkbox = this.page.locator(selector).nth(i);
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }
  }

  /**
   * Wait for multiple elements
   * @param {Array<string>} selectors - Array of CSS selectors
   */
  async waitForElements(selectors) {
    for (const selector of selectors) {
      await this.waitForElement(selector);
    }
  }

  /**
   * Get all locators matching selector
   * @param {string} selector - CSS selector
   * @returns {Promise<Array>}
   */
  async getAllLocators(selector) {
    return await this.page.locator(selector).all();
  }
}

module.exports = BasePage;
