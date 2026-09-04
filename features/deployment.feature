Feature: Contractor Employee Deployment Details Validation and Update

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  @deployment_cancel_validation
  Scenario Outline: Validate Deployment details, modify fields, click Cancel, and verify original details persist
    # 1. Create Employee
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

    # 2. Search and Open Edit Form
    Then User searches created employee status in grid by identity number
    And User verifies employee status in grid is "Active"
    When User clicks on Edit icon for the created employee

    # 3. Deployment Tab Actions & Cancel Verification (Direct Verification on same page after Cancel)
    And User clicks on "Deployment" tab in employee profile
    Then User verifies deployment fields match initial created details Subsidiary "<Subsidiary>", Division "<Division>", Department "<Department>", Category "<Category>", Grade "<Grade>", Designation "<Designation>", Location "<Location>", Skilled Level "<Skill>", and Contractor "<Contractor>"
    When User modifies deployment fields with temporary values
    And User clicks on Cancel button in deployment form
    Then User verifies deployment fields match initial created details Subsidiary "<Subsidiary>", Division "<Division>", Department "<Department>", Category "<Category>", Grade "<Grade>", Designation "<Designation>", Location "<Location>", Skilled Level "<Skill>", and Contractor "<Contractor>"

    Examples:
      | FirstName | LastName | Gender | DOB         | ContractFrom | ContractPeriodDays | Subsidiary     | Division | Department | Category       | Grade | Designation | Location | Skill        | Contractor |
      | Shubham   | Lele     | M      | 18-May-1983 | 27-Aug-2025  | 171                | A.k enterprise | Sales    | Software   | Staff Employee | B     | Jr Engineer | Pune     | Semi-Skilled | GG ROOT    |

  @update @deployment_update_validation
  Scenario Outline: Validate Deployment details, modify fields, click Update, and verify changes persist
    # 1. Create Employee First
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

    # 2. Search and Open Edit Form
    When User searches created employee status in grid by identity number
    Then User verifies employee status in grid is "Active"
    When User clicks on Edit icon for the created employee

    # 3. Deployment Tab Update & Persist Verification (Needs Edit re-click after Update redirect)
    And User clicks on "Deployment" tab in employee profile
    Then User verifies deployment fields match initial created details Subsidiary "<Subsidiary>", Division "<Division>", Department "<Department>", Category "<Category>", Grade "<Grade>", Designation "<Designation>", Location "<Location>", Skilled Level "<Skill>", and Contractor "<Contractor>"
    When User modifies deployment fields with new values
    And User clicks on Update button in deployment form
    Then User verifies deployment update success message appears
    When User clicks on Edit icon for the created employee
    And User clicks on "Deployment" tab in employee profile
    Then User verifies deployment fields match newly updated values

    Examples:
      | FirstName | LastName | Gender | DOB         | ContractFrom | ContractPeriodDays | Subsidiary     | Division | Department | Category       | Grade | Designation | Location | Skill        | Contractor |
      | Rohit     | Joshi    | M      | 12-Jun-1990 | 27-Aug-2025  | 180                | A.k enterprise | Sales    | Software   | Staff Employee | B     | Jr Engineer | Pune     | Semi-Skilled | GG ROOT    |