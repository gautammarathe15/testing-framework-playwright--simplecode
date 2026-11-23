Feature: Contractor Employee Grid Search and Verification

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  # Scenario: Complete Lifecycle - Create Employee and Search in Grid
  @e2e @searchEmployee
  Scenario Outline: Verify searching created contractor employee in grid using dynamic identity number
    When User clicks on the Create button
    Then User verifies identity card input field is visible
    When User enters identity number "<IdentityNumber>"
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    And User fills all required deployment details and submits the form
    Then User searches created employee by identity number in grid
    And The grid should display employee record matching created identity number

    Examples:
      | IdentityNumber   |
      | [Auto_Generated] |