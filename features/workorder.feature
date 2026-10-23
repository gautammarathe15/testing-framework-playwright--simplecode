  @workorder
Feature: Employee Assign Work Order Management

 Background:

    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    And User enters "2731532" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    Given User clicks on the Assign Work Order Option menu
    When User selects Work Order ID "1013" from the dropdown
    And User extracts Effective From and Employee To Date

  @workorder_create
  Scenario: Verify successful creation of Employee Work Order with validations and table check
    
    
    And User attempts an invalid Effective From date before joining date and handles popup
    And User selects a valid Effective From date
    And User attempts an invalid Effective To date after contract period and handles popup
    And User selects a valid Effective To date
    When User clicks on the Save Work Order button
    Then User clicks on OK button on the work order success popup
    And User should see the saved work order details in the assignment table


    @workorder_update
  Scenario: Verify update of Employee Work Order with table verification, date changes, and edit flow
    Given User clicks on the Assign Work Order Option menu
    And User verifies the previously saved work order details in table "dtWorkOrderList"
    When User clicks on the edit pencil button in the work order table
    And User selects Work Order ID "1016" with text "Auto - 1313" from the dropdown
    And User sets Effective From as the next day of previous effective date from calendar
    And User sets Effective To as the Contract Period To date from calendar
    Then User validates that the Update button is visible and clicks on it
    And User clicks on OK button on the update success popup
    And User should see the updated work order details in table "dtWorkOrderList"