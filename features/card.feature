@card_module
Feature: Contractor Employee Card Management Flow for New and Existing Employees

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  Scenario: Validate Card allocation features under Card tab for a New Employee
    When User clicks on the Create button
    And User verifies Aadhaar Card input field is visible
    And User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    And User fills mandatory Personal details with First Name "Mangal", Last Name "Sodhi", Gender "M", and DOB "10-Dec-1918"
    And User fills Contract Period details with Contract From "29-Aug-2025" and Contract Period In Days "990"
    And User fills all mandatory Deployment details with Subsidiary "A.k enterprise", Division "Sales", Department "Software", Category "Staff Employee", Grade "B", Designation "Jr Engineer", Location "Pune", Skilled Level "Semi-Skilled", and Contractor "GG ROOT"
    And User verifies default Status is "Active"
    And User clicks on the Save button
    And User clicks on OK button on success popup
    When User searches created employee status in grid by identity number
    And User clicks on Edit icon for the created employee
    When User clicks on "Card" tab in employee profile
    Then User verifies 'Allocate Temporary Card' button is visible
    When User clicks on "Allocate Temporary Card" button
    Then User verifies "Card Number" label and input textbox are visible
    Then User verifies "Effective From" label and input textbox are visible
    And User verifies mandatory field red symbols are visible
    And User verifies "Save" and "Cancel" buttons are visible

  Scenario: Validate Card allocation features under Card tab for an Existing Employee
    When User enters "5500" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    When User clicks on "Card" tab in employee profile
    Then User verifies 'Allocate Temporary Card' button is visible
    When User clicks on "Allocate Temporary Card" button
    Then User verifies "Card Number" label and input textbox are visible
    Then User verifies "Effective From" label and input textbox are visible
    And User verifies mandatory field red symbols are visible
    And User verifies "Save" and "Cancel" buttons are visible

  Scenario: Validate successful temporary card allocation with dynamic unique card number and today's date
    When User enters "5500" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    When User clicks on "Card" tab in employee profile
    And User clicks on "Allocate Temporary Card" button
    And User enters dynamic card number based on Aadhaar
    And User selects today's date in Effective From field
    And User clicks on the Save button for card allocation
    Then User verifies card allocation success message

  Scenario: Validate error message when Effective To date is earlier than Effective From
    When User enters "5500" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    When User clicks on "Card" tab in employee profile
    And User clicks on "Allocate Temporary Card" button
    And User enters dynamic card number based on Aadhaar
    And User enters an invalid date range where Effective To is earlier than Effective From
    And User clicks on the Save button for card allocation
    Then User verifies popup message "date must be greater than from date" is displayed