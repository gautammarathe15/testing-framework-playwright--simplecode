Feature: Contractor Employee Master Verification

  Scenario: Verify Create and Upload options are visible on Contractor Employee Page
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    Then User should see the Create and Upload options on the Contractor Employee page