
    Feature: Contractor Employee Master Verification

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button

  # Scenario 1: UI वर बटने दिसतात का हे तपासणे
  Scenario: Verify Create and Upload options are visible on Contractor Employee Page
    And User clicks on the Contractor Employee menu option
    Then User should see the Create and Upload options on the Contractor Employee page

  # Scenario 2: +Create वर क्लिक करून Inspector उघडेल
  Scenario: Click on Create button and inspect elements
    And User clicks on the Contractor Employee menu option
    And User clicks on the Create button
    Then Playwright Inspector should open for further recording