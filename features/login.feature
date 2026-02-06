Feature: User Login
  As a user
  I want to login to the application
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given user navigates to the login page
    When user enters email "gautammarathe15@gmail.com"
    And user enters password "Password@15"
    And user clicks the login button
    Then user should be logged in successfully

  Scenario Outline: Book a Ticket after login
    Given user is logged in
    And user navigates to homepage
    When user selects origin for "<TestNo>"
    And user selects destination for "<TestNo>"
    And user selects date as tomorrow
    And user clicks search button
    Then search results should be displayed

    Examples:
      | TestNo | origin | destination |
      | 1      | Pune   | Shimoga     |
      | 2      | Mumbai | Hubli   | 
      
