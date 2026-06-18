# language: en
@ATTENDANCE @MODULE
Feature: Attendance Management

  Background:
    Given User is logged in to the CLMS application
    And User navigates to Attendance module

  @ATTENDANCE_MANUAL
  Scenario: Add manual attendance
    When User navigates to Manual Attendance
    And User adds manual attendance with following details:
      | Field        | Value              |
      | Employee ID  | EMP001             |
      | Date         | 2026-06-20         |
      | Check-in     | 08:30              |
      | Check-out    | 17:00              |
      | Status       | Present            |
      | Remarks      | Work from home      |
    Then Attendance record should be added successfully
    And Record should be visible in attendance table

  @ATTENDANCE_EDIT
  Scenario: Edit manual attendance
    Given Manual attendance record exists for employee
    When User edits the attendance record with following details:
      | Field        | Value              |
      | Check-in     | 08:15              |
      | Check-out    | 17:30              |
    Then Attendance record should be updated successfully
    And Updated details should reflect in the system

  @ATTENDANCE_APPROVAL
  Scenario: Approve pending attendance
    Given Manager has pending attendance records
    When Manager approves attendance record for employee "EMP001"
    And Manager adds approval comments
    Then Attendance should be approved successfully
    And Status should change to "Approved"

  @ATTENDANCE_DELETE
  Scenario: Delete manual attendance
    Given Manual attendance record exists
    When User navigates to Delete Manual Attendance
    And User searches records to delete
    And User selects attendance record for deletion
    And User confirms deletion
    Then Attendance record should be deleted successfully

  @ATTENDANCE_BULK_UPLOAD
  Scenario: Bulk upload attendance
    When User navigates to Manual Attendance
    And User clicks Bulk Upload button
    And User selects attendance file
    And User confirms upload
    Then Attendance records should be uploaded successfully
    And System displays upload summary with count

  @OUT_DUTY_CREATE
  Scenario: Create out-of-duty request
    When User navigates to Out Duty
    And User creates out-of-duty request with following details:
      | Field       | Value                |
      | Employee ID | EMP001               |
      | Start Date  | 2026-06-21           |
      | End Date    | 2026-06-21           |
      | Start Time  | 10:00                |
      | End Time    | 12:00                |
      | Purpose     | Client meeting       |
    Then Out-duty request should be created successfully
    And Status should be "Pending Approval"

  @OUT_DUTY_APPROVE
  Scenario: Approve out-of-duty request
    Given Manager has pending out-duty requests
    When Manager approves the out-duty request
    Then Request status should change to "Approved"
    And Employee receives notification

  @OUT_DUTY_REJECT
  Scenario: Reject out-of-duty request
    Given Manager has pending out-duty requests
    When Manager rejects the out-duty request
    And Manager provides rejection reason
    Then Request status should change to "Rejected"

  @WEEK_OFF_ASSIGN
  Scenario: Assign weekly off day
    When User navigates to Week Off Default
    And User assigns week off with following details:
      | Field            | Value              |
      | Employee ID      | EMP001             |
      | Day              | Sunday             |
      | Alternate Day    | Saturday           |
      | Effective Date   | 2026-06-25         |
    Then Week off should be assigned successfully
    And Assignment should be visible in week off list

  @ACCESS_CARD_ISSUE
  Scenario: Issue access card
    When User navigates to Access Card
    And User issues card with following details:
      | Field         | Value           |
      | Employee ID   | EMP001          |
      | Card Number   | AC12345678      |
      | Card Type     | RFID Card       |
      | Issue Date    | 2026-06-20      |
      | Expiry Date   | 2027-06-20      |
    Then Access card should be issued successfully
    And Card should be visible in card list

  @ACCESS_CARD_DEACTIVATE
  Scenario: Deactivate access card
    Given Access card exists for employee
    When User deactivates the access card
    And User confirms deactivation
    Then Card status should change to "Inactive"

  @WEEK_OFF_TEMPLATE
  Scenario: Create week-off shift template
    When User navigates to Week Off Shift Template
    And User creates template with following details:
      | Field         | Value                 |
      | Template Name | 5-Day Work Pattern    |
      | Cycle Type    | Weekly                |
      | Cycle Days    | 7                     |
      | Week Off Days | Saturday, Sunday      |
    Then Template should be created successfully
    And Template should be available for assignment

  @ATTENDANCE_REPORT
  Scenario: Generate attendance report
    When User navigates to Attendance Reports
    And User selects date range from "2026-06-01" to "2026-06-30"
    And User selects employees for report
    And User clicks Generate Report button
    Then System should generate attendance report
    And Report should display in required format

  @ATTENDANCE_FILTER
  Scenario Outline: Filter attendance records
    When User navigates to Attendance view
    And User filters by <filter_type> with value "<value>"
    Then System should display filtered attendance records
    And Records should match the applied filter

    Examples:
      | filter_type | value    |
      | Employee ID | EMP001   |
      | Status      | Present  |
      | Date Range  | Week     |
