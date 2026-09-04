@status_change_validation @regression @status_change_active_to_left_to_active
Feature: Contractor Employee Status Update and Count Validation

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  Scenario Outline: Verify employee status change from Active to Left and back to Active with header count validations
    # 🔹 1. Capture Initial Counts
    Given User captures the current Active Count and Total Count from UI header

    # 🔹 2. Create Employee via Form
    When User clicks on the Create button
    And User verifies Aadhaar Card input field is visible
    And User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    And User fills mandatory Personal details with First Name "<FirstName>", Last Name "<LastName>", Gender "<Gender>", and DOB "<DOB>"
    And User fills Contract Period details with Contract From "<ContractFrom>" and Contract Period In Days "<ContractPeriodDays>"
    And User fills all mandatory Deployment details with Subsidiary "<Subsidiary>", Division "<Division>", Department "<Department>", Category "<Category>", Grade "<Grade>", Designation "<Designation>", Location "<Location>", Skilled Level "<Skill>", and Contractor "<Contractor>"
    And User verifies default Status is "Active"
    And User clicks on the Save button
    And User clicks on OK button on success popup

    # 🔹 3. ACTIVE -> LEFT FLOW (With Date Validations & Form Button Checks)
    Then User searches created employee status in grid by identity number
    And User verifies employee status in grid is "Active"
    When User clicks on Edit icon for the created employee
    Then User verifies pre-filled form details match First Name "<FirstName>", Last Name "<LastName>", Gender "<Gender>", and Location "<Location>"
    And User verifies Delete button is visible on employee edit form
    When User updates status from "Active" to "Left"
    And User clicks on the Update button
    And User clicks on OK button on success popup
    When User selects today date as Resignation Date and verifies Relieving Date auto-populates
    And User clicks on Update button after filling dates
    And User clicks on OK button on success popup
    And User clicks on Cancel button

    # 🔹 4. Validate Grid & Header Counts after Left
    And User verifies Active Count decreased by 1
    And User verifies Left Count increased by 1
    And User verifies Total Count remains unchanged
    Then User searches created employee status in grid by identity number
    And User verifies employee status in grid is "Left"

    # 🔹 5. LEFT -> ACTIVE REVERSAL FLOW (Re-activation)
    When User clicks on Edit icon for the created employee
    Then User verifies pre-filled form details match First Name "<FirstName>", Last Name "<LastName>", Gender "<Gender>", and Location "<Location>"
    When User updates status from "Left" to "Active"
    And User clicks on the Update button
    And User clicks on OK button on success popup
    And User clicks on Cancel button

    # 🔹 6. Validate Grid & Header Counts back to Original Active State
    And User verifies Active Count increased by 1
    And User verifies Left Count decreased by 1
    And User verifies Total Count remains unchanged
    Then User searches created employee status in grid by identity number
    And User verifies employee status in grid is "Active"

    Examples:
      | FirstName | LastName | Gender | DOB         | ContractFrom | ContractPeriodDays | Subsidiary     | Division | Department | Category       | Grade | Designation | Location | Skill        | Contractor |
      | Shubham   | Lele     | M      | 18-May-1983 | 27-Aug-2025  | 171                | A.k enterprise | Sales    | Software   | Staff Employee | B     | Jr Engineer | Pune     | Semi-Skilled | GG ROOT    |





Scenario Outline: Verify employee status change from Left to Terminated and Absconded with count and Aadhaar grid validation
    # 🔹 1. Capture Initial Counts
    Given User captures the current Active Count and Total Count from UI header

    # 🔹 2. Create Employee & Change Status to Left (Initial Setup)
    When User clicks on the Create button
    And User verifies Aadhaar Card input field is visible
    And User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    And User fills mandatory Personal details with First Name "<FirstName>", Last Name "<LastName>", Gender "<Gender>", and DOB "<DOB>"
    And User fills Contract Period details with Contract From "<ContractFrom>" and Contract Period In Days "<ContractPeriodDays>"
    And User fills all mandatory Deployment details with Subsidiary "<Subsidiary>", Division "<Division>", Department "<Department>", Category "<Category>", Grade "<Grade>", Designation "<Designation>", Location "<Location>", Skilled Level "<Skill>", and Contractor "<Contractor>"
    And User clicks on the Save button
    And User clicks on OK button on success popup
    Then User searches created employee status in grid by identity number
    When User clicks on Edit icon for the created employee
    When User updates status from "Active" to "Left"
    And User clicks on the Update button
    And User clicks on OK button on success popup
    When User selects today date as Resignation Date and verifies Relieving Date auto-populates
    And User clicks on Update button after filling dates
    And User clicks on OK button on success popup
    And User clicks on Cancel button

    # 🔹 3. LEFT -> TERMINATED FLOW
    Then User searches created employee status in grid by identity number
    When User clicks on Edit icon for the created employee
    When User updates status to "<TargetStatus1>"
    And User clicks on the Update button
    And User clicks on OK button on success popup
    When User selects today date as Resignation Date and verifies Relieving Date auto-populates
    And User clicks on Update button after filling dates 
    And User clicks on OK button on success popup
    And User clicks on Cancel button

    # 🔹 4. Validate Counts & Grid Search by Aadhaar for Terminated
    And User verifies Active Count remains unchanged
    And User verifies Left Count remains unchanged
    And User verifies Total Count remains unchanged
    Then User searches employee in grid by captured Aadhaar number
    And User verifies employee status in grid is "<TargetStatus1>"

    When User clicks on Edit icon for the created employee
    When User updates status to "<TargetStatus2>"
    And User clicks on the Update button
    And User clicks on OK button on success popup
    When User fills mandatory exit dates based on status
    And User clicks on Update button after filling dates
    And User clicks on OK button on success popup
    And User clicks on Cancel button

    # 🔹 6. Validate Counts & Grid Search by Aadhaar for Absconded
    And User verifies Active Count remains unchanged
    And User verifies Left Count remains unchanged
    And User verifies Total Count remains unchanged
    Then User searches employee in grid by captured Aadhaar number
    And User verifies employee status in grid is "<TargetStatus2>"

    Examples:
      | FirstName | LastName | Gender | DOB         | ContractFrom | ContractPeriodDays | Subsidiary     | Division | Department | Category       | Grade | Designation | Location | Skill        | Contractor | TargetStatus1 | TargetStatus2 |
      | Nishant   | More     | M      | 01-May-1988 | 11-Aug-2025  | 300                | A.k enterprise | Sales    | Software   | Staff Employee | B     | Jr Engineer | Pune     | Semi-Skilled | GG ROOT    | Terminated    | Absconded     |