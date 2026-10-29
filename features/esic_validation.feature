@esic_validation
Feature: ESIC Number Validation in Other Details

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "166393" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User clicks on "Other Details" tab in employee profile

  Scenario Outline: Validate ESIC number input with various formats
    When User enters ESIC number "<esicValue>" in ESIC input field
    And User clicks on the Update or Save button for ESIC
    Then User should see ESIC validation result message "<expectedMessage>"

    Examples: 
      | esicValue   | expectedMessage                                                                |
      | 6800100700  |  Updated Successfully                                                          |
      |             |  Updated Successfully                                                          |
      | 787878      | ESINo :787878ESIC Number should be a 10 digits value.                          |
      | 1234857463  | ESI no already exists                                                          |