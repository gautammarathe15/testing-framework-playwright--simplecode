Feature: Contractor Employee Detailed Form Verification and Validations

  Background:
    Given User opens the CLMS login application page
    When User enters username "Green" and password "sa"
    And User clicks on the Login button

  Scenario: Verify all tabs, sections, and fields on Contractor Employee Form
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    Then User verifies Aadhaar Card input field is visible
    When User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    Then User should see Submit and Skip Verification options and click Skip Verification
    Then User pauses execution for locator inspection
    Then User should see all form tabs sections and input fields on Contractor Employee page

  @Regression @Smoke @Validation
  Scenario Outline: Verify "please First Create Employee" popup for all restricted tabs
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    Then User verifies Aadhaar Card input field is visible
    When User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    Then User should see Submit and Skip Verification options and click Skip Verification
    When User clicks on the "<TabName>" tab without filling basic employee details
    Then A validation popup with message "please First Create Employee" should appear
    And User clicks the "OK" button on the popup to dismiss it

    Examples:
      | TabName                    |
      | Deployment                 |
      | Reporting Manager          |
      | Shift                      |
      | Card                       |
      | Week Off                   |
      | Other Detail               |
      | Address                    |
      | Family Member              |
      | Qualification              |
      | Experience                 |
      | Training                   |
      | Document                   |
      | Assets/PPE                 |
      | Salary Allocation          |
      | Penalty / Fine             |
      | Assign Work Order          |
      | Nomination                 |
      | Medical Checkup            |
      | Disciplinary Action        |
      | Police Verification        |
      | Project Salary             |
      | Employee Accident Register |
      | Onboarding Fields          |

  Scenario: Verify Check Verification section expand, collapse and field interaction functionality
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    Then User verifies Aadhaar Card input field is visible
    When User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    Then User should see Submit and Skip Verification options and click Skip Verification
    When User expands the Check Verification section if collapsed
    Then User verifies and interacts with Background Checked and Medical Check Up fields
    And User verifies editable remark fields with dynamic inputs:
      | remarkBackground | Background check verified successfully |
      | remarkMedical    | Medical checkup completed fine         |
    When User collapses the Check Verification section
    Then Verification sub-fields should not be visible
    When User expands the Check Verification section again
    Then Previously entered remark data should be retained