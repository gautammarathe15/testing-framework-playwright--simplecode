@passport_validation
Feature: Passport Number Validation in Contractor Employee Other Details

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "46838" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User clicks on "Other Details" tab in employee profile

  Scenario Outline: Validate Passport number input with various formats and rules
    When User enters Passport number "<passportValue>" with expiry date "<expiryDate>"
    And User clicks on the Update or Save button for Passport
    Then User should see Passport validation result message "<expectedMessage>"

    Examples:
      | passportValue | expiryDate   | expectedMessage                                          |
      | Z1234561      | 20-10-2045   | Passport No Without PassportExpiration Date Not Accepted |
      | Z1234560      |              | Passport No Without PassportExpiration Date Not Accepted |
      | 22445678      | 20-10-2045   | Passport Number: "22445678" Is InValid                 |
      | Ind53535      | 20-10-2045   | Passport Number: "Ind53535" Is InValid                 |
      | 121           | 20-10-2045   | Passport Number: "121" Is InValid                        |
      | ABABABAB      | 20-10-2045   | Passport Number: "ABABABAB" Is InValid                 |
      |               |              | Updated Successfully                                     |