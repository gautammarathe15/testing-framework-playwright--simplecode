@pan_validation @smoke
Feature: CLMS Employee PAN Number Validation Testing

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "300595" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid 
    And User clicks on "Other Details" tab in employee profile

  Scenario Outline: Validate PAN card input with various valid and invalid formats
    When User enters PAN number "<PanNumber>" in PAN input field
    And User clicks on the Update or Save button for PAN
    Then User should see validation result message "<ExpectedMessage>"

  Examples:
    | PanNumber    | ExpectedMessage                                        |
    | PTTTY1134F   | success                                                |
    | ajgdb0734f   | success                                                |
    | UHJBP1204Z   | success                                                |
    | WQ1EDQWDE    | PAN Value: WQ1EDQWDE should be a 10 alphanumeric value.|
    | 11111HHHH    | PAN Value: 11111HHHH should be a 10 alphanumeric value. |    
    | )88882%7&D   | Invalid PAN Card No                                    |
    | ABCDEFGHIJ   | Invalid PAN Card No                                    |
    | 1234567890   | Invalid PAN Card No                                    |