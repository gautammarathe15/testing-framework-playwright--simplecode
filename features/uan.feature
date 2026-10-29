
 @uan_number_validation
Feature: UAN Number Validation in Contractor Employee Other Details

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "166393" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User clicks on "Other Details" tab in employee profile

  Scenario Outline: Validate UAN number input with various formats and boundary rules
    When User enters UAN number "<uanValue>"
    And User clicks on the Update or Save button for UAN
    Then User should see UAN validation result message "<expectedMessage>"

    Examples:
      | uanValue     | expectedMessage                         |
      | 101100456180 | UAN already exists                      |
      | UNIQUE       | Updated Successfully                    |
      |              | Updated Successfully                    |
      | 12345679     | UAN :12345679 Should be 12 digit Number |
      | 000000000000 | UAN already exists                      |