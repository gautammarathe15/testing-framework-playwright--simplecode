@qualification_module
Feature: Contractor Employee Qualification Add and Validation Flow

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "91312" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User clicks on the Qualification tab
    

  Scenario: Verify Qualification form mandatory red asterisk fields and visibility
  And User clicks on the Create Qualification option
    Then User should see all qualification form fields are visible
    And User should verify red asterisk indicators are present for Education Title, Course Degree, University, Month, and Year

  Scenario: Verify validation message when mandatory qualification fields are left empty
  And User clicks on the Create Qualification option
    When User clicks on the Save button for Qualification without filling data
    Then User should see qualification validation result message "Fill all mandatory fields with appropriate data"
    And User clicks the OK button on the qualification popup

  Scenario: Verify successful addition of employee qualification with valid data
  And User clicks on the Create Qualification option
    When User selects education title "Graduate" from dropdown
    And User selects course degree "Test" from dropdown
    And User enters stream "Aeronautical Engineering"
    And User checks HR Verified checkbox if available
    And User selects university "Pune" from dropdown
    And User selects passing month "December" from dropdown
    And User enters passing year "2022"
    And User clicks on the Save button for Qualification
    Then User should see qualification validation result message "Saved Successfully"
    And User clicks the OK button on the qualification popup
    And User verifies the newly added qualification details exist in the grid:
      | Education Title | Course Degree | University     | Passing Month | Passing Year |
      | Graduate        | Test          | Pune           | December      | 2022         |



    Scenario: Verify successful update of existing employee qualification
    And User clicks on the Edit option for the existing qualification in the grid
    When User updates education title to "High School" from dropdown
    And User updates course degree to "Test" from dropdown
    And User updates stream to "Computer Applications"
    And User updates university to "Pune" from dropdown
    And User updates passing month to "May" from dropdown
    And User updates passing year to "2026"
    And User clicks on the Update button for Qualification
    Then User should see qualification validation result message "Updated Successfully"
    And User clicks the OK button on the qualification popup
    And User logs the qualification update comparison report with old and new details