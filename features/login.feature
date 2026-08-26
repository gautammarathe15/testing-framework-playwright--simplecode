Feature: CLMS Login Functionality Verification

  Background:
    Given User opens the CLMS login application page
  @login 
  Scenario: Validate Username and Password fields are visible and editable
    Then User verifies that the Username input field is visible and editable
    And User verifies that the Password input field is visible and editable
  @login @Positive
  # 🟢 3 POSITIVE SCENARIOS (Valid Username variations with valid password)
  Scenario Outline: Successful login with valid credentials (Positive Scenarios)
    When User enters username "<username>" and password "<password>"
    And User clicks on the Login button
    Then User should be navigated to the main application dashboard

    Examples:
      | username | password | Comment            |
      | admin    | sa       | Admin Account      |
      | Green    | sa       | Green Account      |
      | 1003     | sa       | Numeric Account ID |
  @login @Negative
  # 🔴 3 NEGATIVE SCENARIOS (Incorrect input validation)
  Scenario Outline: Unsuccessful login with invalid credentials (Negative Scenarios)
    When User enters username "<username>" and password "<password>"
    And User clicks on the Login button
    Then User should see an appropriate authentication error message

    Examples:
      | username | password | Comment                     |
      | admin    | wrong_sa | Invalid Password            |
      | Invalid  | sa       | Invalid Username            |
      |          |          | Empty Credentials Submission|