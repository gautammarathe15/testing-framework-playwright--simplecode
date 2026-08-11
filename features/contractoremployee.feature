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

  # Scenario 3: Pop-up वरील Close (x) symbol वर क्लिक करून +Create visible होणे
  Scenario: Verify clicking close symbol on popup returns to main UI with Create button
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    And User clicks on the Close symbol on popup
    Then User should see the Create button on the Contractor Employee page

  # Scenario 4: Pop-up वरील Close button वर क्लिक करून Upload visible होणे
  Scenario: Verify clicking Close button on popup returns to main UI with Upload button
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    And User clicks on the Close button on popup
    Then User should see the Upload button on the Contractor Employee page

  # Scenario 5: Dynamic Aadhaar Card Input & Verify (User Input)
  Scenario Outline: Enter Aadhaar number dynamically and click Verify on popup
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    Then User verifies Aadhaar Card input field is visible
    When User enters Aadhaar number "<AadhaarNumber>"
    And User clicks on the Verify link if visible
    Then Playwright Inspector should open for further recording

    Examples:
      | AadhaarNumber |
      | 895645893029 |

  # Scenario 6: Verify Submit & Skip Verification buttons and click Skip Verification
  Scenario Outline: Verify Submit and Skip Verification options after clicking Verify
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    Then User verifies Aadhaar Card input field is visible
    When User enters Aadhaar number "<AadhaarNumber>"
    And User clicks on the Verify link if visible
    Then User should see Submit and Skip Verification options and click Skip Verification
    Then Playwright Inspector should open for further recording

    Examples:
      | AadhaarNumber |
      | 789023321278 |