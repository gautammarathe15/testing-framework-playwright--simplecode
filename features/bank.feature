@bank_validation
Feature: Bank Details and IFSC Code Validation in Contractor Employee Other Details

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "300595" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User clicks on "Other Details" tab in employee profile

  Scenario Outline: Validate Bank dropdown options, IFSC Code and Account Number rules
    When User selects bank option "<bankName>" from the Bank dropdown
    And User enters IFSC code "<ifscValue>"
    And User enters branch name "<branchName>"
    And User enters Bank Account number "<accountNo>"
    And User clicks on the Update or Save button for Bank details
    Then User should see Bank validation result message "<expectedMessage>"




    Examples:
      | bankName | ifscValue     | branchName | accountNo      | expectedMessage                                    |
      | HDFC     | HDFC0001277   | Pune       | UNIQUE         | Updated Successfully                               |
      | SBI      | SBIN0001247   | Mumbai     | UNIQUE         | Updated Successfully                               |
      | PNB      | PUNB0101047   | Nashik     | UNIQUE         | Updated Successfully                               |
      | CBI      | CBIN0001247   | Nagpur     | UNIQUE         | Updated Successfully                               |
      | ICICI    | ICIC0001247   | Pune       | UNIQUE         | Updated Successfully                               |
      | SBI      | 12345678901   | Pune       | 15150880025888 | IFSC Code: "12345678901" is Invalid.               |
      | SBI      | SBIN12345     | Pune       | 15150800025888 | IFSC Code: "SBIN12345" is Invalid.                 |
      | PNB      | PUNB0001240   | Pune       | 1##001         | Bank account no already exists                              |
      | Select   | SBIN0001247   |            | 15150280025888 | Please select bank,if you have given bank details  |