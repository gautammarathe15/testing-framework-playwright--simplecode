@disciplinary_action
Feature: Employee Disciplinary Action Module Automation

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    And User enters "2731532" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    Given User clicks on the Disciplinary Action menu option

  @NegativeValidation 
  Scenario: 1. Verify negative validation for mandatory fields in Disciplinary Action
  
  When User checks and clicks on the Create Disciplinary Action button
  And User selects the 1st date of current month in Action Taken On Date
  And User selects Reason as Disciplinary Action from dropdown
  And User selects current date in Issue Reported Date
  And User enters Issue as "<issueValue>"
  And User enters Action Taken as "<actionValue>"
  And User clicks on the Save button for disciplinary action
  Then User should see mandatory validation popup for disciplinary with message "<expectedMessage>"

  Examples:
    | issueValue                | actionValue       | expectedMessage                                 |
    |                           | Automation Tester | Fill all mandatory fields with appropriate data |
    | Tested Automation Testing |                   | Fill all mandatory fields with appropriate data |
    |                           |                   | Fill all mandatory fields with appropriate data |
    @PositiveValidation
  Scenario: 2. Verify successful creation of Employee Disciplinary Action
    
    When User checks and clicks on the Create Disciplinary Action button
    And User selects the 1st date of current month in Action Taken On Date
    And User selects Reason as Disciplinary Action from dropdown
    And User selects current date in Issue Reported Date
    And User enters Issue as "Tested Automation Testing"
    And User enters Action Taken as "Automation Tester"
    Then User validates that Cancel button is visible and clicking it hides the table
    When User checks and clicks on the Create Disciplinary Action button
    And User selects the 1st date of current month in Action Taken On Date
    And User selects Reason as Disciplinary Action from dropdown
    And User selects current date in Issue Reported Date
    And User enters Issue as "Tested Automation Testing"
    And User enters Action Taken as "Automation Tester"
    Then User validates that Save button is visible
    When User clicks on the Save button for disciplinary action
    And User clicks on OK button on the disciplinary success popup with message "Saved Successfully"
    Then User should see the saved disciplinary action details in the table and verify match 


    # Try creating duplicate record with same details
     Scenario: 3. Verify duplicate record validation for Employee Disciplinary Action


    When User checks and clicks on the Create Disciplinary Action button
    And User selects the 1st date of current month in Action Taken On Date
    And User selects Reason as Disciplinary Action from dropdown
    And User selects current date in Issue Reported Date
    And User enters Issue as "Tested Automation Testing"
    And User enters Action Taken as "Automation Tester"
    And User clicks on the Save button for disciplinary action
    Then User should see duplicate record validation popup for disciplinary with message "Disciplinary action record for this date already exists."

 

 @UpdateValidation-Action
  Scenario: 4. Verify successful update of Employee Disciplinary Action
   

    When User clicks on the edit pencil icon of the first disciplinary record
    And User clears Action Taken On Date and selects today's date
    Then User validates that Update button is visible
    When User clicks on the Update button for disciplinary action
    And User clicks on OK button on the disciplinary update popup with message "Updated Successfully"
    Then User should see the updated disciplinary action details in the table and verify unchanged fields