@pf_number_validation
Feature: PF Number Validation in Contractor Employee Other Details

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "46838" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User clicks on "Other Details" tab in employee profile

  Scenario Outline: Validate PF number input with various formats and boundary rules
    When User enters PF number "<pfValue>"
    And User clicks on the Update or Save button for PF
    Then User should see PF validation result message "<expectedMessage>"

    Examples:
      | pfValue                 | expectedMessage                                     |
      | MHBAN09990610012515099  | Updated Successfully                                |
      |                         | Updated Successfully                                |
      | MHBAN090906455099       | PF Number: "MHBAN090906455099" Is InValid.          |
      | mHBAN09090640005555099  | PF Number: "mHBAN09090640005555099" Is InValid.     |
      | MHBAN00000640005555000  | PF no already exists                                |
