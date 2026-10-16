@document_
Feature: Employee Document Module Validation

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    And User enters "95550" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User navigates to Document tab


  Scenario: 1. Verify validation when submitting without mandatory fields
    When User clicks on Create New Document tab
    And User clicks on Save Document button
    Then User should see document popup message "Fill all mandatory fields with appropriate data"
    And User clicks OK on document popup

  Scenario: 2. Verify validation for invalid file format upload
    When User clicks on Create New Document tab
    And User selects Document Category as "Salary"
    And User uploads invalid file format with .xlsx extension
    And User clicks on Save Document button
    Then User should see document popup message "Please Select Valid File"
    And User clicks OK on document popup

  Scenario: 3. Verify successful document creation and table verification
    When User clicks on Create New Document tab
    And User selects Document Category as "Identity proof"
    And User selects Document Type as "Passport"
    And User uploads a valid file "documentTab-Testing-PNG.png"
    And User clicks on Save Document button
    Then User should see document popup message "Saved Successfully"
    And User clicks OK on document popup
    And User verifies document details in the list table

    Scenario: 4. Verify document update functionality and comparison report
    When User navigates to Document tab
    And User captures current document details as old details
    And User checks if edit pencil icon is visible and clicks on it
    When User selects Document Category as "Permanent address proof"
    And User selects Document Type as "Passport"
    And User clicks on Update Document button
    Then User should see document popup message "Updated Successfully"
    And User clicks OK on document popup
    Then User verifies updated document details in the list table and generates comparison report


    Scenario: 6. Verify delete functionality with cancel and confirmation
    When User navigates to Document tab
    And User checks if delete icon is visible and clicks on it
    Then User verifies document details still exist in the list table
    When User clicks on delete icon again and accepts the alert
    Then User should see document popup message "Delete record successfully"
    And User clicks OK on document popup
    Then User verifies document details are removed from the list table