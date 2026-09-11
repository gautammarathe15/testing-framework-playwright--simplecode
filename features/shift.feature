@shift_module
Feature: Contractor Employee Shift Management

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  Scenario Outline: Verify Shift operations with Auto Shift and specific shift selections
    When User clicks on the Create button
    And User verifies Aadhaar Card input field is visible
    And User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    And User fills mandatory Personal details with First Name "<FirstName>", Last Name "<LastName>", Gender "<Gender>", and DOB "<DOB>"
    And User fills Contract Period details with Contract From "<ContractFrom>" and Contract Period In Days "<ContractDays>"
    And User fills all mandatory Deployment details with Subsidiary "<Subsidiary>", Division "<Division>", Department "<Department>", Category "<Category>", Grade "<Grade>", Designation "<Designation>", Location "<Location>", Skilled Level "<SkilledLevel>", and Contractor "<Contractor>"
    And User verifies default Status is "Active"
    And User clicks on the Save button
    And User clicks on OK button on success popup

    # --- Shift Tab Flow ---
    When User searches created employee status in grid by identity number
    And User clicks on Edit icon for the created employee
    And User clicks on "Shift" tab in employee profile
    And User selects "Auto Shift Applied" checkbox
    And User selects shift option "<FirstShift>"
    And User should see Save button and Cancel button visible for first time entry
    And User clicks on the Shift Save button
    And User clicks on OK button on success popup

    # --- Verify Update and Multiple Shifts ---
   
    Then User should see Update button and Cancel button visible
    And Shift option "<FirstShift>" should be checked on UI

    # --- Additional shift selection for 2nd example or general validation ---
    When User selects shift option "<SecondShift>"
    And User clicks on the Shift Update button
    And User clicks on OK button on success popup
    Then Shift option "<FirstShift>" and shift option "<SecondShift>" should be checked on UI

    Examples:
      | FirstName | LastName | Gender | DOB         | ContractFrom | ContractDays | Subsidiary      | Division | Department | Category       | Grade | Designation | Location | SkilledLevel | Contractor | FirstShift | SecondShift |
      | Hira      | S        | F      | 15-Jan-1990 | 01-Mar-2026  | 90           | A.k enterprise  | Sales    | Software   | Staff Employee | B     | Jr Engineer | Pune     | Semi-Skilled | GG ROOT    | Night Shift | Second      |
      | Amit      | Patil    | M      | 20-May-1992 | 02-Mar-2026  | 60           | A.k enterprise  | Sales    | Software   | Staff Employee | A     | Engineer    | Pune     | Skilled      | GG ROOT    | Second      | Night Shift |