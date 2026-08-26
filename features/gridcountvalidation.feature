@count_validation @regression
Feature: Contractor Employee Header Count Dynamic Verification

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  @form_create_count @countvalidation
  Scenario Outline: Verify Active and Total count increment on Single Employee Creation via Form
    Given User captures the current Active Count and Total Count from UI header
    When User clicks on the Create button
    And User verifies Aadhaar Card input field is visible
    And User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    # 🔹 Reuse existing steps from @saveEmployee scenario:
    And User fills mandatory Personal details with First Name "<FirstName>", Last Name "<LastName>", Gender "<Gender>", and DOB "<DOB>"
    And User fills Contract Period details with Contract From "<ContractFrom>" and Contract Period In Days "<ContractPeriodDays>"
    And User fills all mandatory Deployment details with Subsidiary "<Subsidiary>", Division "<Division>", Department "<Department>", Category "<Category>", Grade "<Grade>", Designation "<Designation>", Location "<Location>", Skilled Level "<Skill>", and Contractor "<Contractor>"
    And User verifies default Status is "Active"
    And User clicks on the Save button
    Then User verifies Total Count increased by 1
    And User verifies Active Count increased by <ActiveIncrease>

    Examples:
      | FirstName | LastName | Gender | DOB         | ContractFrom | ContractPeriodDays | Subsidiary     | Division | Department | Category       | Grade | Designation | Location | Skill        | Contractor | ActiveIncrease |
      | Harish    | Patil    | M      | 15-May-1995 | 20-Aug-2026  | 10                 | A.k enterprise | Sales    | Software   | Staff Employee | A     | Jr Engineer | Pune     | Semi-Skilled | GG ROOT    | 1              |

  @excel_upload_count @countvalidation
  Scenario: Verify Active and Total count increment dynamically after Bulk Excel Upload
    Given User captures the current Active Count and Total Count from UI header
    When User batch uploads all excel test sheets from folder "features/testdata"
    Then User verifies Total and Active Count increased by total successful uploaded records