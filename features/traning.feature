@training_module
Feature: Contractor Employee Training Module Verification

    Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "166393" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User navigates to Training tab

  Scenario: 1. Verify From Date validation against Employee Joining Date
    When User clicks on Create New Training tab
    And User selects Program as "Manual testing"
    And User sets From Date less than employee joining date
    And User enters Hours as "3"
    And User clicks on Save Training button
    Then User should see popup message "From Date should not be less than Joining Date Of an Employee"

  Scenario: 2. Verify permissible range for hours per day validation
    When User clicks on Create New Training tab
    And User selects Program as "Manual testing"
    And User selects valid From Date and To Date
    And User clears the Hours field
    And User clicks on Save Training button
    Then User should see popup message "Permissible range for hours per day is 1-24"
    When User clicks OK on the popup

  Scenario: 3. Verify validation when Program ID is not selected
    When User clicks on Create New Training tab
    And User keeps Program as "Select"
    And User selects valid dates and fills valid details
    And User clicks on Save Training button
    Then User should see popup message "Fill all mandatory fields with appropriate data"
    When User clicks OK on the popup

  Scenario: 4. Verify validation when Conducted By Faculty is empty
    When User clicks on Create New Training tab
    And User selects Program as "Manual testing"
    And User selects valid dates and fills other details leaving Conducted By empty
    And User clicks on Save Training button
    Then User should see popup message "Fill all mandatory fields with appropriate data"

  Scenario: 5. Verify successful training creation and table data re-verification
    When User clicks on Create New Training tab
    And User selects Program as "Manual testing"
    And User selects valid From Date and To Date
    And User enters Hours as "3"
    And User enters Conducted By as "HR Pannel" and Conducted Company as "Zaroda Infotech"
    And User clicks on Save Training button
    Then User should see popup message "Saved Successfully"
    Then User verifies training details in the list table