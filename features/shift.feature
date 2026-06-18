# language: en
@SHIFT @MODULE
Feature: Shift Management

  Background:
    Given User is logged in to the CLMS application
    And User navigates to Shift module

  @SHIFT_CREATE
  Scenario: Create a new shift successfully
    When User creates a new shift with the following details:
      | Field       | Value                    |
      | Shift Name  | Morning Shift            |
      | Start Time  | 08:00                    |
      | End Time    | 04:00 PM                 |
      | Description | Standard morning shift   |
    Then Shift should be created successfully
    And Shift "Morning Shift" should be visible in the shift list

  @SHIFT_EDIT
  Scenario: Edit an existing shift
    Given A shift "Morning Shift" exists in the system
    When User edits the shift "Morning Shift" with following details:
      | Field       | Value          |
      | Start Time  | 07:00          |
      | End Time    | 03:00 PM       |
    Then Shift should be updated successfully
    And Updated shift details should reflect in the list

  @SHIFT_DELETE
  Scenario: Delete a shift
    Given A shift "Morning Shift" exists in the system
    When User deletes the shift "Morning Shift"
    And User confirms the deletion
    Then Shift should be deleted successfully
    And Shift "Morning Shift" should not be visible in the list

  @SHIFT_SEARCH
  Scenario: Search for a shift
    Given Multiple shifts exist in the system
    When User searches for shift "Morning Shift"
    Then Search results should display shift "Morning Shift"

  @SHIFT_POLICY
  Scenario: Create shift policy
    When User navigates to Shift Policy
    And User creates a shift policy with following details:
      | Field              | Value           |
      | Policy Name        | Standard Policy |
      | Break Duration     | 60              |
      | Overtime Rule      | Auto Calculate  |
    Then Shift policy should be created successfully
    And Policy "Standard Policy" should be visible in policy list

  @SHIFT_ROTATION
  Scenario: Create shift rotation pattern
    When User navigates to Shift Rotation Pattern
    And User creates a rotation pattern with following details:
      | Field           | Value                    |
      | Pattern Name    | 5-Day Pattern            |
      | Cycle Type      | Weekly                   |
      | Cycle Length    | 7                        |
      | Shift Sequence  | M,M,M,M,M,Off,Off        |
    Then Rotation pattern should be created successfully
    And Pattern "5-Day Pattern" should be visible in pattern list

  @SHIFT_CORRECTION
  Scenario: Create and approve shift correction
    When User navigates to Shift Correction
    And User creates a shift correction with following details:
      | Field           | Value             |
      | Employee ID     | EMP001            |
      | Date            | 2026-06-20        |
      | Original Shift  | Morning           |
      | New Shift       | Evening           |
      | Reason          | Coverage needed   |
    Then Shift correction should be created successfully
    And Manager can approve the correction
    And Correction status should change to "Approved"
