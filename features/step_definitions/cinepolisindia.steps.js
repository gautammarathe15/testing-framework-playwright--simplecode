const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { CinepolisHomePage } = require('../../pages/cineHomePage');
const { BookingPage } = require('../../pages/cinebookingPage');
const { SeatPage } = require('../../pages/cineseatPage');

let homePage;
let bookingPage;
let seatPage;

Given('I navigate to the Cinépolis homepage', async function () {
    homePage = new CinepolisHomePage(this.page);
    bookingPage = new BookingPage(this.page);
    seatPage = new SeatPage(this.page);
    await this.page.goto('https://www.cinepolisindia.com');
});

Given('I select {string} as my city', async function (city) {
    await homePage.selectCity(city);
});

Given('I choose the cinema {string} and movie {string}', async function (cinema, movie) {
    await homePage.selectCinemaAndMovie(cinema, movie);
});

When('I select the first available date and time', async function () {
    await bookingPage.selectDateAndTime();
});

When('I select the first available seat in Row {string}', async function (row) {
    // This calls your optimized SeatPage logic
    await seatPage.selectFirstAvailableSeatInRowB();
});

Then('I should be navigated to the Booking Summary page', async function () {
    await expect(bookingPage.summaryHeading).toBeVisible();
    await this.page.screenshot({ path: 'screenshots/cucumber-summary.png' });
});