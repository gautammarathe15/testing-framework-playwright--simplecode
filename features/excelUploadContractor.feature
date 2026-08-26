Feature: Contractor Employee Excel Bulk Upload and Search Validation

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  @excelUpload @contractor_employeesheet_upload
  Scenario: Validate Excel Upload popup UI elements and verify batch data search functionality
    Then User verifies the Excel Upload icon is visible on Contractor Employee grid
    When User clicks on the Excel Upload icon
    Then User verifies the Employee Upload popup is displayed with title and Close button
    And User verifies no file is chosen initially in the input field
    
    # 🚀 Enhanced & Descriptive Steps
    When User batch uploads all excel test sheets from folder "features/testdata"
    Then User verifies upload status counts and extracted records for each iteration
    And User performs single and combined grid searches for uploaded employee records