
@accident

Feature: Employee Accident Management and Its Operation

 Background:

    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    And User enters "2731532" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid 

Scenario: Verify Employee Accident calculation of No Of Days and Report Generation
    When User clicks on Employee Accident Register tab
    And User checks the Create option visibility and clicks on it
    And User selects the 1st date of current month in Date Of Accident
    And User selects the 1st date of current month in Date Of Report
    And User enters Name Of Accident as "car Accident .2"
    And User selects Todays date in Date Of Return
    Then User extracts No Of Days from UI and validates calculation correctly
