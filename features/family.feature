
@family_module
Feature: Contractor Employee Family Member Add, Verify, Update, and Validation Flow

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User enters "166393" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid

  Scenario: Verify Family Member Add and Table Validation
    When User clicks on Family Member link
    Then User should see the Create Family Member option is visible
    When User clicks on the Create Family Member option
    And User enters new family member name "Rahul Darvitkar"
    And User selects relation option "Brother" from the Family Relation dropdown
    And User selects gender "M" from the Gender dropdown
    And User selects family member birthdate "16 Jun 2000"
    When User clicks on the Save button for Family Member
    Then User should see Family Member validation result message "Saved Successfully"
    And User clicks the OK button on the family popup
    And User verifies the newly added family member details exist in the grid with name "Rahul Darvitkar"

  Scenario: Verify Family Member Edit and Update Flow
  When User clicks on Family Member link
    And User clicks on the Edit pencil icon for the family member entry
    And User updates family member name to "Rutuja Davidas Sanp"
    And User selects relation option "Daughter" from the Family Relation dropdown
    And User selects gender "F" from the Gender dropdown
    And User selects family member birthdate "30 Dec 2025"
    When User clicks on the Update button for Family Member
    Then User should see Family Member validation result message "Updated Successfully"
    And User clicks the OK button on the family popup
    And User verifies the updated family member details match in the grid:
      | Relation | Gender | Birthdate   |
      | Daughter | F      | 30 Dec 2025 |