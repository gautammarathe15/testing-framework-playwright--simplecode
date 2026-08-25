Feature: Contractor Employee Excel Bulk Upload Validation

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  @excelUpload @contractor_employeesheet_upload
  Scenario: Validate Excel Upload popup UI elements and batch upload test sheets dynamically
    Then User verifies the Excel Upload icon is visible on Contractor Employee grid
    When User clicks on the Excel Upload icon
    Then User verifies the Employee Upload popup is displayed with title and Close button
    And User verifies no file is chosen initially in the input field
    
    When User uploads all excel sheets from folder "features/testdata" and verifies status dynamically