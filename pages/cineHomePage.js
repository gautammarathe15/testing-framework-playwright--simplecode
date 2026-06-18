class CinepolisHomePage {
    constructor(page) {
        this.page = page; 
        
        this.citySearchBox = page.getByRole('searchbox', { name: 'Search a City' });
        this.cityButton = (cityName) => this.page.getByRole('button', { name: cityName, exact: true });
        this.cinemaDropdown = page.getByRole('combobox', { name: 'Select Cinema' });
        this.movieDropdown = page.getByRole('combobox', { name: 'Select Movie' });
        
        // Use a Regular Expression with 'i' (ignore case) for better matching
        this.dropdownOption = (name) => this.page.getByText(new RegExp(name, 'i'));
    }

    async selectCity(cityName) {
        await this.citySearchBox.waitFor({ state: 'visible' });
        await this.citySearchBox.click();
        await this.citySearchBox.fill(cityName);
        
        const targetCity = this.cityButton(cityName);
        await targetCity.waitFor({ state: 'visible' });
        await targetCity.click();
    }

    async selectCinemaAndMovie(cinemaName, movieName) {
        // 1. Handle Cinema Selection
        await this.cinemaDropdown.click();

        // Use the flexible regex-based locator and select the first match
        const cinemaOption = this.dropdownOption(cinemaName).first();
        
        // Wait for it to be visible before clicking
        await cinemaOption.waitFor({ state: 'visible', timeout: 15000 });
        await cinemaOption.click();

        // 2. Handle Movie Selection
        await this.movieDropdown.click();
        
        const movieOption = this.dropdownOption(movieName).first();
        await movieOption.waitFor({ state: 'visible' });
        await movieOption.click();
    }
}

module.exports = { CinepolisHomePage };