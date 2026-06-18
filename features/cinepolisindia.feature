Feature: Cinépolis Movie Booking Flow

  As a user
  I want to select a movie and a seat
  So that I can proceed to the payment summary

  @Smoke
  Scenario: Successfully select a seat in Row B and proceed
    Given I navigate to the Cinépolis homepage
    And I select "Pune" as my city
    And I choose the cinema "Cinépolis Seasons" and movie "RAJA SHIVAJI (MARATHI)"
    When I select the first available date and time
    And I select the first available seat in Row "B"
    Then I should be navigated to the Booking Summary page