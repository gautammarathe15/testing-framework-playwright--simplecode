@medical_checkup
Feature: Employee Medical Checkup Management

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    And User enters "300595" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    Given User clicks on the Medical Checkup menu option

  Scenario: Verify successful creation of Employee Medical Checkup with validations and table check
    When User extracts the employee join date
    And User clicks on the Create Medical Checkup button
    And User selects extracted join date into Checkup Date field
    And User enters description as "Automation Auto Fill Data & Extracted Date"
    Then User validates that both Save and Cancel buttons are visible
    When User clicks on the Save button for medical checkup
    Then User clicks on OK button on the success popup with message "Saved Successfully"
    And User should see the saved medical checkup details in the table

  Scenario Outline: Verify negative validation for mandatory fields in Medical Checkup
    Given User clicks on the Medical Checkup menu option
    And User clicks on the Create Medical Checkup button
    When User leaves "<CheckupDateStatus>" and enters "<DescriptionStatus>"
    And User clicks on the Save button for medical checkup
    Then User should see mandatory validation popup with message "Fill all mandatory fields with appropriate data"
    And Extended report table should display empty field status, entered details, and popup messages

    Examples:
      | CheckupDateStatus | DescriptionStatus |
      | Empty             | Filled            |
      | Filled            | Empty             |
      | Empty             | Empty             |


    Scenario: Verify created medical checkup details match in the list table
    When User captures the filled medical checkup details
    Then User should see the same details correctly displayed in the table

  Scenario: Verify successful update of Employee Medical Checkup by adding 6 days to Checkup Date
    When User clicks on the edit pencil icon for the medical checkup record
    And User updates the Checkup Date by adding 6 days to the existing date
    And User clicks on the Update button
    Then User clicks on OK button on the update success popup with message "Updated Successfully"
    And User should see the updated medical checkup details reflected in the table