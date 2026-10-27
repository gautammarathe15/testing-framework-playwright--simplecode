@experience
Feature: Contractor Employee Qualification Add and Validation Flow

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "92997637" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid

  Scenario: Verify Employee Experience form functionality, validations, and saving
    When User clicks on the "Experience" tab
    And User clicks on the Create option in Experience tab
    When User enters Company Name "Nilkamal Furniture" in Experience form
    And User selects today's date in From Date calendar
    And User selects next one year date in To Date calendar
    And User enters Designation "finance regional manager"
    And User checks the HR Verified checkbox
    And User checks the All Skill Set checkbox
    Then All skill set checkboxes High, Low, Mid-Skilled should be automatically selected
    When User clicks on the Save button for Experience
    And User handles the browser confirmation dialog
    Then A success popup with message "Saved Successfully" should appear for Experience
    And User clicks the "OK" button on the Experience popup
    And User clicks on the Cancel button for Experience
    And User verifies the saved experience details match on the UI for "Nilkamal Furniture"

  Scenario: Verify Employee Experience update functionality for Company Name, Skills and HR Verified
    When User clicks on the "Experience" tab
    And User clicks on the Edit icon in Experience grid
    When User enters Company Name "Rayat School" in Experience form
    And User unchecks the Low-Skilled checkbox
    When User clicks on the Update button for Experience
    And User handles the browser confirmation dialog
    Then A success popup with message "Updated Successfully" should appear for Experience
    And User clicks the "OK" button on the Experience popup
    And User verifies the saved experience details match on the UI for "Rayat School"
    When User clicks on the Edit icon in Experience grid
    And User unchecks the HR Verified checkbox
    When User clicks on the Update button for Experience
    And User handles the browser confirmation dialog
    Then A success popup with message "Updated Successfully" should appear for Experience
    And User clicks the "OK" button on the Experience popup
    And User verifies the saved experience details match on the UI for "Rayat School"