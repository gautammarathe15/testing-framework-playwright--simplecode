Feature: Contractor Employee Form Data Filling, Verification, Editing and Mandatory Field Validations

  Background:
    Given User opens the CLMS login application page
    When User enters username "Green" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    Then User verifies Aadhaar Card input field is visible
    When User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    Then User should see Submit and Skip Verification options and click Skip Verification

  @Validation @Smoke
  Scenario: Verify mandatory asterisk indicators and field validations on save
    Then User verifies all mandatory fields are marked with red asterisk
    When User clicks on Save button without filling mandatory details
    Then System should display validation errors for required fields

  @Validation @Smoke @Regression
  Scenario: Verify mandatory field alert popup, handle OK, complete form and save
    When User scrolls to Save button and clicks Save
    Then System should display "Fill all mandatory fields" alert popup
    When User clicks on OK button on the alert popup
    And User fills remaining mandatory fields with the following details:
      | firstName         | Rahul                      |
      | middleName        | Prakash                    |
      | lastName          | Patil                      |
      | fatherHusbandName | Prakash Patil              |
      | gender            | M                       |
      | panNo             | ABCDE1234F                 |
      | pfNo              | MH/PUN/0012345/000/0000101 |
    And User selects options for all mandatory dropdowns
    And User scrolls to Save button and clicks Save
    Then User verifies contractor employee details saved successfully

  @Regression
  Scenario: Verify filling form fields, scrolling to save, and validating inserted data
    When User fills the Contractor Employee form with the following details:
      | firstName         | Rahul                      |
      | middleName        | Prakash                    |
      | lastName          | Patil                      |
      | fatherHusbandName | Prakash Patil              |
      | gender            | M                       |
      | panNo             | ABCDE1234F                 |
      | pfNo              | MH/PUN/0012345/000/0000101 |
    And User scrolls to Save button and clicks Save
    Then User verifies that inserted details match with displayed details

  @Regression
  Scenario: Verify filling, saving, matching data, and editing contractor employee details
    When User fills the Contractor Employee form with the following details:
      | firstName | Ratan      |
      | lastName  | Solankhi   |
      | panNo     | XYZDE9876K |
    And User scrolls to Save button and clicks Save
    Then User verifies that inserted details match with displayed details
    When User edits the form fields with updated details:
      | firstName | Amit       |
      | lastName  | Bharti     |
      | panNo     | PQRST5544L |
    And User scrolls to Save button and clicks Save
    Then User verifies updated data is correctly populated in input fields
    And User verifies contractor employee details saved successfully


    @Birthday @Calendar @Regression
  Scenario: Verify Birthday Calendar display, headers, and navigation
    When User clicks on the Birthday input field
    Then Birthday calendar should be displayed successfully
    And Calendar month header should be visible
    And Previous month "«" and Next month "»" controls should be visible
    When User clicks on the Previous month "«" button
    Then Previous month details should be displayed in the calendar header
    When User clicks on the Next month "»" button
    Then Next month details should be displayed in the calendar header

  @Birthday @Age_Validation @Regression
  Scenario: Verify validation popup when employee age is less than 18 years
    When User selects a birth date resulting in age less than 18 years
    And User scrolls to Save button and clicks Save
    Then Validation popup indicating age restriction should be displayed
    When User clicks OK on the age validation popup
    Then Form should not be saved and user remains on the same page

  @Birthday @Age_Validation @Regression
  Scenario: Verify successful save when employee age is greater than 18 years
    When User selects a birth date resulting in age greater than 18 years
    And User scrolls to Save button and clicks Save
    Then Age validation popup should not be displayed
    And Contractor Employee details should be saved successfully


     # =========================================================================
  # Scenario 1 : Contract From Calendar Controls & UI Verification
  # =========================================================================
  @contractDates
  Scenario: Verify Contract From calendar open and month navigation controls
    When User clicks on Contract From date field
    Then Contract From date calendar should be displayed successfully
    And Calendar month header should display current month
    When User clicks on previous month "«" button in Contract From calendar
    Then Header should display the previous month name
    When User clicks on next month "»" button in Contract From calendar
    Then Header should display the updated month name

  # =========================================================================
  # Scenario 2 : Contract To Auto-Calculation Logic Verification
  # =========================================================================
  @contractDates
  Scenario Outline: Verify Contract To date is auto-calculated based on Contract From date and Days
    When User enters Contract From date as "<ContractFrom>"
    And User enters Contract Period In Days as "<Days>"
    Then Contract To date field should be readonly and non-editable
    And Contract To date should be auto-filled as "<ExpectedContractTo>"

    Examples:
      | ContractFrom | Days | ExpectedContractTo |
      | 04-Mar-2026  | 15   | 19-Mar-2026        |
      | 01-Jan-2026  | 30   | 31-Jan-2026        |
      | 10-Feb-2026  | 10   | 20-Feb-2026        |