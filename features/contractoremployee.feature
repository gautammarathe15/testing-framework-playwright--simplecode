@REGRESSION @MODULE @CONTRACTOR
Feature: Contractor Employee Option Navigation and Verification
  As a Automation Test Engineer
  I want to verify the "Contractor Employee" option visibility via different navigation paths
  So that I can ensure the application's core navigation works perfectly

  Background:
    Given user is logged in to the CLMS application

  # 🎯 Type 1: Master Menu Navigation
  @Smoke
  Scenario: Verify Contractor Employee option via Top Master Menu Header
    When user clicks on the "Master" menu in the header
    Then user should see "Employee" option visible
    And the "Contractor Employee" option should be visible inside Employee section

  # 🎯 Type 2: Dashboard Quick Sector Navigation
  Scenario: Verify Contractor Employee option via Dashboard Sector Buttons
    When user is on the main dashboard
    Then the "Employee Sector" widget/section should be visible
    And the "Contractor Employee" button should be visible inside it

  # 🎯 Type 3: Menu Toggle Sidebar Navigation
  Scenario: Verify Navigation toggle and redirect consistency between Sidebar and Dashboard
    When user clicks on the "menuToggleBtn" to open sidebar
    Then the "Dashboard" and "Master" options should be visible in the sidebar menu
    When user clicks on "Dashboard" from sidebar
    Then user should see the same Dashboard page with "Contractor Employee" sector button
    When user clicks on "Master" from sidebar
    Then user should see the "Contractor Employee" option under header master flow
