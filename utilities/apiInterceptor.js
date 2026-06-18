/**
 * API Interception Utility for Cinepolis Tests
 * Handles mocking and intercepting API calls
 */

class APIInterceptor {
  constructor(page) {
    this.page = page;
    this.interceptedRequests = [];
    this.interceptedResponses = [];
  }

  /**
   * Initialize API interception for all requests
   */
  async initializeInterception() {
    await this.page.on('request', (request) => {
      this.interceptedRequests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        timestamp: new Date(),
      });
    });

    await this.page.on('response', (response) => {
      this.interceptedResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: new Date(),
      });
    });
  }

  /**
   * Mock movie list API response
   */
  async mockMovieListAPI() {
    await this.page.route('**/api/movies**', async (route) => {
      await route.abort('failed');
    });
  }

  /**
   * Mock successful movie list API response
   */
  async mockMovieListAPISuccess(mockData = null) {
    await this.page.route('**/api/movies**', async (route) => {
      const defaultData = mockData || [
        {
          id: 1,
          title: 'Avengers: Endgame',
          rating: 8.4,
          format: '2D, 3D, IMAX',
          language: 'English',
        },
        {
          id: 2,
          title: 'The Lion King',
          rating: 8.5,
          format: '2D',
          language: 'Hindi, English',
        },
      ];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(defaultData),
      });
    });
  }

  /**
   * Mock location/theater API
   */
  async mockLocationAPI() {
    await this.page.route('**/api/locations**', async (route) => {
      const locations = [
        { id: 1, name: 'Bangalore', city: 'BLR', theaters: 5 },
        { id: 2, name: 'Mumbai', city: 'MUM', theaters: 8 },
        { id: 3, name: 'Delhi', city: 'DEL', theaters: 6 },
      ];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(locations),
      });
    });
  }

  /**
   * Mock showtime API
   */
  async mockShowtimeAPI() {
    await this.page.route('**/api/showtimes**', async (route) => {
      const showtimes = [
        { time: '09:30 AM', format: '2D', price: 300, available: true },
        { time: '01:00 PM', format: '3D', price: 400, available: true },
        { time: '04:30 PM', format: 'IMAX', price: 500, available: false },
        { time: '08:00 PM', format: '2D', price: 350, available: true },
      ];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(showtimes),
      });
    });
  }

  /**
   * Mock seat availability API
   */
  async mockSeatAvailabilityAPI() {
    await this.page.route('**/api/seats**', async (route) => {
      const seats = {
        total: 100,
        available: 45,
        booked: 55,
        layout: [
          { row: 'A', seats: [1, 2, 3, 4, 5] },
          { row: 'B', seats: [1, 2, 3, 4, 5] },
          { row: 'C', seats: [1, 2, 3, 4, 5] },
        ],
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(seats),
      });
    });
  }

  /**
   * Mock booking confirmation API
   */
  async mockBookingConfirmationAPI(shouldSucceed = true) {
    await this.page.route('**/api/booking/confirm**', async (route) => {
      if (shouldSucceed) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            bookingId: 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            message: 'Booking confirmed successfully',
          }),
        });
      } else {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Booking failed',
          }),
        });
      }
    });
  }

  /**
   * Mock API failure
   */
  async mockAPIFailure(urlPattern = '**api**') {
    await this.page.route(urlPattern, async (route) => {
      await route.abort('failed');
    });
  }

  /**
   * Mock API timeout
   */
  async mockAPITimeout(urlPattern = '**api**') {
    await this.page.route(urlPattern, async (route) => {
      await route.abort('timedout');
    });
  }

  /**
   * Get all intercepted requests
   */
  getInterceptedRequests() {
    return this.interceptedRequests;
  }

  /**
   * Get all intercepted responses
   */
  getInterceptedResponses() {
    return this.interceptedResponses;
  }

  /**
   * Get request by URL
   */
  getRequestByUrl(urlPattern) {
    return this.interceptedRequests.filter((req) => req.url.includes(urlPattern));
  }

  /**
   * Clear intercepted data
   */
  clearInterceptedData() {
    this.interceptedRequests = [];
    this.interceptedResponses = [];
  }

  /**
   * Verify API was called
   */
  verifyAPIWasCalled(urlPattern, expectedMethod = null) {
    const requests = this.getRequestByUrl(urlPattern);
    if (requests.length === 0) {
      throw new Error(`API ${urlPattern} was not called`);
    }

    if (expectedMethod && !requests.some((req) => req.method === expectedMethod)) {
      throw new Error(`API ${urlPattern} was not called with method ${expectedMethod}`);
    }

    return true;
  }
}

module.exports = APIInterceptor;
