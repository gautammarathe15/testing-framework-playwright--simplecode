@Address
Feature: Contractor Employee Address Details

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "95550" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    When User clicks on the "Address" tab


  Scenario Outline: Verify Permanent and Current Address form functionality, validations, and saving

    And User leaves address fields blank and clicks on the Save button
    Then A validation popup with message "Fill all mandatory fields with appropriate data" should appear
    And User clicks the "OK" button on the popup to dismiss it
    
    When User enters Permanent Address details "<AddressLine1>" and pincode "<Pincode>"
    And User selects Country "<Country>", State "<State>", and City "<City>"
    And User selects current date in Permanent Address Effective From calendar
    And User clicks on the Save button
    Then A validation popup with message "Fill all mandatory fields with appropriate data" should appear
    And User clicks the "OK" button on the popup to dismiss it
    
    When User checks the "Same As Permanent Address" checkbox
    Then Current Address fields should match with Permanent Address details "<AddressLine1>"
    
    When User clicks on the Save button for Address
    Then A success popup with message "Saved Successfully" should appear
    And User clicks the "OK" button on the popup to dismiss it
    And User verifies the saved address details match on the UI "<AddressLine1>"

    Examples:
      | AddressLine1      | Pincode | Country | State       | City   |
      | Tech Park Tower 7.| 411000  | India   | Maharashtra | Pune   |

  Scenario Outline: Verify Update Permanent and Current Address flow
    When User clicks on the "Address" tab
    When User updates Permanent Address details "<UpdatedAddressLine1>" and pincode "<UpdatedPincode>"
    And User selects Country "<Country>", State "<State>", and City "<City>"
    And User selects current date in Permanent Address Effective From calendar
    And User checks the "Same As Permanent Address" checkbox
    Then Current Address fields should match with Permanent Address details "<UpdatedAddressLine1>"
    When User clicks on the Save button for Address
    Then A success popup with message "Updated Successfully" should appear
    And User clicks the "OK" button on the popup to dismiss it
    And User verifies the saved address details match on the UI "<UpdatedAddressLine1>"

    Examples:
      | UpdatedAddressLine1    | UpdatedPincode | Country | State       | City      |
      | Emsphere Office Pune   | 411150         | India   | Maharashtra | Pune      |