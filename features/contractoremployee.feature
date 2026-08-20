Feature: Contractor Employee Master Verification

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  # Scenario 1: Verify visibility of Create and Upload buttons on UI
  Scenario: Verify Create and Upload options are visible on Contractor Employee Page
    Then User should see the Create and Upload options on the Contractor Employee page

  # Scenario 2: Verify Create button action and popup display
  Scenario: Click on Create button and verify popup opens
    When User clicks on the Create button
    Then User verifies identity card input field is visible

  # Scenario 3: Verify clicking popup close (x) icon returns to main UI with Create button visible
  Scenario: Verify clicking close symbol on popup returns to main UI with Create button
    When User clicks on the Create button
    And User clicks on the Close symbol on popup
    Then User should see the Create button on the Contractor Employee page

  # Scenario 4: Verify clicking popup Close button returns to main UI with Upload button visible
  Scenario: Verify clicking Close button on popup returns to main UI with Upload button
    When User clicks on the Create button
    And User clicks on the Close button on popup
    Then User should see the Upload button on the Contractor Employee page

  # Scenario 5: Dynamic Identity Card input entry and verification trigger
  Scenario Outline: Enter identity number dynamically and click Verify on popup
    When User clicks on the Create button
    Then User verifies identity card input field is visible
    When User enters identity number "<IdentityNumber>"
    And User clicks on the Verify link if visible

    Examples:
      | IdentityNumber   |
      | [Auto_Generated] |

  # Scenario 6: Verify Submit and Skip Verification options after clicking Verify link
  Scenario Outline: Verify Submit and Skip Verification options after clicking Verify
    When User clicks on the Create button
    Then User verifies identity card input field is visible
    When User enters identity number "<IdentityNumber>"
    And User clicks on the Verify link if visible
    Then User should see Submit and Skip Verification options and click Skip Verification

    Examples:
      | IdentityNumber   |
      | [Auto_Generated] |