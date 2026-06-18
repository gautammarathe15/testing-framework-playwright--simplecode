/**
 * Common Test Utilities
 * Shared utility functions for all tests
 */

class TestUtils {
  /**
   * Wait for a specified number of milliseconds
   * @param {number} ms - Milliseconds to wait
   */
  static async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate random string
   * @param {number} length - Length of string
   * @returns {string}
   */
  static generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random number between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number}
   */
  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Select random item from array
   * @param {Array} array - Array to select from
   * @returns {*}
   */
  static getRandomItem(array) {
    if (!array || array.length === 0) {
      return null;
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Format date to YYYY-MM-DD
   * @param {Date} date - Date to format
   * @returns {string}
   */
  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Parse currency string to number
   * @param {string} currencyString - Currency string (e.g., "₹ 500")
   * @returns {number}
   */
  static parseCurrency(currencyString) {
    if (!currencyString) return 0;
    const numbers = currencyString.replace(/[^\d.]/g, '');
    return parseFloat(numbers) || 0;
  }

  /**
   * Compare two arrays
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @returns {boolean}
   */
  static arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item === arr2[index]);
  }

  /**
   * Deep clone object
   * @param {Object} obj - Object to clone
   * @returns {Object}
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Check if string contains substring
   * @param {string} str - Main string
   * @param {string} substring - Substring to find
   * @returns {boolean}
   */
  static containsSubstring(str, substring) {
    return str && str.toLowerCase().includes(substring.toLowerCase());
  }

  /**
   * Retry a function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Initial delay in ms
   * @returns {Promise<*>}
   */
  static async retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        const waitTime = delay * Math.pow(2, attempt - 1);
        await this.sleep(waitTime);
      }
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone to validate
   * @returns {boolean}
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone numbers
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  /**
   * Get current timestamp
   * @returns {string}
   */
  static getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Log with timestamp
   * @param {string} message - Message to log
   * @param {string} level - Log level (INFO, WARN, ERROR)
   */
  static log(message, level = 'INFO') {
    console.log(`[${this.getTimestamp()}] [${level}] ${message}`);
  }

  /**
   * Create screenshot filename
   * @param {string} testName - Name of the test
   * @returns {string}
   */
  static getScreenshotFileName(testName) {
    return `${testName}-${this.getTimestamp()}.png`;
  }

  /**
   * Compare two numbers with tolerance
   * @param {number} num1 - First number
   * @param {number} num2 - Second number
   * @param {number} tolerance - Tolerance level
   * @returns {boolean}
   */
  static numbersCloseEnough(num1, num2, tolerance = 0.01) {
    return Math.abs(num1 - num2) <= tolerance;
  }

  /**
   * Extract numbers from string
   * @param {string} str - String to extract from
   * @returns {Array<number>}
   */
  static extractNumbers(str) {
    if (!str) return [];
    const matches = str.match(/\d+/g);
    return matches ? matches.map(Number) : [];
  }

  /**
   * Capitalize first letter
   * @param {string} str - String to capitalize
   * @returns {string}
   */
  static capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  /**
   * Truncate string to specified length
   * @param {string} str - String to truncate
   * @param {number} length - Max length
   * @returns {string}
   */
  static truncate(str, length = 50) {
    return str && str.length > length ? str.substring(0, length) + '...' : str;
  }
}

module.exports = TestUtils;
