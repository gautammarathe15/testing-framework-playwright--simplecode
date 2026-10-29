@police
Feature: Contractor Employee Police Verification Module

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    And User enters "166393" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid


    Scenario: 1. Verify police verification fails when Verification Date is blank
    When User clicks on Police Tab
    And User checks visibility of create button and clicks on it
    And User leaves Verification Date blank
    And User enters description as Verification done by Automation Tester with selected date
    And User checks visibility of Save option and clicks on it
    Then User should see popup message "Fill all mandatory fields with appropriate data" and clicks OK

  Scenario: 2. Verify police verification fails when Description is blank
    When User clicks on Police Tab
    And User checks visibility of create button and clicks on it
    And User selects the current month 1st date in Verification Date textbox
    And User leaves Description blank
    And User checks visibility of Save option and clicks on it
    Then User should see popup message "Fill all mandatory fields with appropriate data" and clicks OK

  Scenario: 3. Verify successful police verification creation with month start date
    When User clicks on Police Tab
    And User checks visibility of create button and clicks on it
    And User selects the current month 1st date in Verification Date textbox
    And User enters description as Verification done by Automation Tester with selected date
    And User checks visibility of Save option and clicks on it
    Then User should see popup message "Saved Successfully" and clicks OK
    And User verifies saved details correctly display in table

  Scenario: 4. Verify police verification with previous date (current date - 1)
    When User clicks on Police Tab
    And User checks visibility of create button and clicks on it
    And User selects current date minus 1 in Verification Date textbox
    And User enters description as Verification done by Automation Tester with selected date
    And User checks visibility of Save option and clicks on it
    Then User should see popup message "Saved Successfully" and clicks OK
    And User verifies saved details correctly display in table

  Scenario: 5. Verify police verification update functionality
    When User clicks on Police Tab
    And User checks pencil icon visibility and clicks on it for edit
    And User selects Todays date in Verification Date textbox
    And User enters description as Verification done by Automation Tester with selected date
    And User checks visibility of Update option and clicks on it
    Then User should see popup message "Updated Successfully" and clicks OK
    And User verifies saved details correctly display in table