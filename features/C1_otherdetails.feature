@otherdetails @smoke
Feature: CLMS Employee Other Details Tab Verification and Reporting

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  Scenario Outline: Verify all fields, upload options, and verification links on Other Details tab
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

    When User searches created employee status in grid by identity number
    And User clicks on Edit icon for the created employee 
   And User clicks on "Other Details" tab in employee profile

    Then User verifies all Other Details form elements and visibility status
    And Extended Report should display table with columns "Option name | Status | Current Details"

  Examples:
    | FirstName | LastName | Gender | DOB         | ContractFrom | ContractDays | Subsidiary     | Division | Department | Category       | Grade | Designation | Location | SkilledLevel | Contractor |
    | Nayan     | Linge    | F     | 21-Jun-1995 | 04-Nov-2026  | 210          | A.k enterprise | Sales    | Software   | Staff Employee | B     | Jr Engineer | Pune     | Semi-Skilled | GG ROOT    |