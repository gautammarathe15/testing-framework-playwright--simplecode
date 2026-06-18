# language: en
@LEAVE @MODULE
Feature: Leave Management

  Background:
    Given User is logged in to the CLMS application
    And User navigates to Leave module

  @LEAVE_APPLY
  Scenario: Apply for annual leave
    When User applies for leave with following details:
      | Field      | Value           |
      | Leave Type | Annual Leave    |
      | Start Date | 2026-07-01      |
      | End Date   | 2026-07-05      |
      | Reason     | Family vacation |
    Then Leave application should be submitted successfully
    And Application status should be "Pending"
    And Manager receives notification for approval

  @LEAVE_WITHDRAW
  Scenario: Withdraw leave application
    Given User has submitted a leave application
    And Application status is "Pending"
    When User withdraws the leave application
    Then Application should be withdrawn successfully
    And Status should change to "Withdrawn"

  @LEAVE_APPROVE
  Scenario: Approve pending leave application
    Given Manager has pending leave applications to review
    And Application is from "EMP001"
    When Manager approves the leave application
    And Manager provides approval comments
    Then Application status should change to "Approved"
    And Employee receives approval notification

  @LEAVE_REJECT
  Scenario: Reject leave application
    Given Manager has pending leave applications to review
    When Manager rejects the leave application
    And Manager provides rejection reason
    Then Application status should change to "Rejected"
    And Employee receives rejection notification

  @LEAVE_BALANCE
  Scenario: Check leave balance
    When User navigates to Leave Balance
    And User selects employee and year
    Then System displays available leave balance
    And Leave balance breakdown shows:
      | Leave Type    | Balance |
      | Annual Leave  | 10      |
      | Sick Leave    | 5       |
      | Casual Leave  | 3       |

  @LEAVE_ADJUSTMENT
  Scenario: Adjust employee leave balance
    When Manager navigates to Leave Balance
    And Manager adjusts leave balance with following details:
      | Field          | Value          |
      | Employee ID    | EMP001         |
      | Leave Type     | Annual Leave   |
      | Days to Add    | 2              |
      | Reason         | Additional day |
    Then Leave balance should be adjusted successfully
    And Adjustment history should record the change

  @HOLIDAY_CREATE
  Scenario: Create holiday
    When User navigates to Holiday List
    And User creates a holiday with following details:
      | Field       | Value             |
      | Holiday Name| Independence Day  |
      | Date        | 2026-08-15        |
      | Type        | National Holiday  |
    Then Holiday should be created successfully
    And Holiday should be visible in holiday list

  @LEAVE_EXPORT
  Scenario: Export leave balance report
    When User navigates to Leave Balance
    And User clicks Export button
    And User selects export format as "PDF"
    Then System should generate and download the report

  @LEAVE_BULK
  Scenario Outline: Apply for different leave types
    When User applies for <leave_type> leave
      | Start Date | End Date   | Days |
      | <start>    | <end>      | <days> |
    Then Application should be submitted with status "Pending"

    Examples:
      | leave_type   | start      | end        | days |
      | Annual Leave | 2026-07-01 | 2026-07-05 | 5    |
      | Sick Leave   | 2026-06-25 | 2026-06-25 | 1    |
      | Casual Leave | 2026-07-10 | 2026-07-11 | 2    |
