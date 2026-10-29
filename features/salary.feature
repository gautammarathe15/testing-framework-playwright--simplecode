@salary_
Feature: Contractor Employee Salary Allocation

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    And User enters "166393" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
    And User clicks on the Employee Salary Structure menu option

  Scenario: 1. Verify salary allocation initial form, joining date validation, and field selections
    And User verifies salary structure table is empty for the first-time allocation
    When User clicks on the Create Salary Structure button
    And User reads the employee joining date from the profile
    And User selects an Effective From date before the joining date
    Then User should see salary popup message "From Date Should Be Greater Than Joining Date"
    And User clicks OK on the salary popup
    And User selects the correct Effective From date matching the joining date month
    When User selects Assign Template as "Salary GG"
    And User selects Salary Structure As "Present"
    And User toggles the "Is Calculate Salary On Hours" checkbox
    And User toggles the "Is Calculate Double On Holiday Present" checkbox
    And User toggles the "Is Calculate Extra Hours On WeekOff Present" checkbox

  @salary_earning_validation
  Scenario: 2. Verify Earning Head amounts sum matches with Total Earning
    When User clicks on the Create Salary Structure button
    And User reads the employee joining date from the profile
    And User selects the correct Effective From date matching the joining date month
    When User selects Assign Template as "Salary GG"
    And User selects Salary Structure As "Present"
    Then User extracts all Earning Head amounts, calculates the sum, and verifies it with Total Earning
    And User attaches the earning calculation breakdown to the cucumber report

  @salary_deduction_validation
  Scenario: 3. Verify Deduction Head amounts sum matches with Total Deduction
    When User clicks on the Create Salary Structure button
    And User reads the employee joining date from the profile
    And User selects the correct Effective From date matching the joining date month
    When User selects Assign Template as "Salary GG"
    And User selects Salary Structure As "Present"
    When User extracts all Deduction Head amounts, calculates the sum, and verifies it with Total Deduction
    And User attaches the deduction calculation breakdown to the cucumber report

  @salary_net_payable_validation
  Scenario: 4. Verify Projected Net payable calculation and display in table format
    When User clicks on the Create Salary Structure button
    And User reads the employee joining date from the profile
    And User selects the correct Effective From date matching the joining date month
    When User selects Assign Template as "Salary GG"
    And User toggles the "Is Calculate Extra Hours On WeekOff Present" checkbox
    When User calculates Projected Net payable as Total Earning minus Total Deduction and verifies it with UI
    And User attaches the salary summary breakdown in a table format to the cucumber report
    And User clicks on the Save button and verifies the record in the salary structure table

  @update
  Scenario: 5. Update and New creation
    And User updates the salary structure with next month effective date and verifies table records

  @salary_duplicate_head_validation
  Scenario Outline: 6. Verify duplicate alert for an already assigned Earning Head
    Then User verifies duplicate alert when assigning existing earning head "<headName>" with amount "<amount>"

    Examples:
      | headName         | amount |
      | Basic            | 20000 |
      | DA               | 4000  |
      | Other_Allowance  | 1000  |

  @salary_additional_heads_validation
  Scenario: 7. Verify additional Earning Heads, amount behaviour and table details
    When User adds additional earning heads and verifies their table details
      | headName              | amountMode | amount | remark                      |
      | Leave_Encashment      | automatic  |        | Leave encashment validation |
      | Shift_Allowance       | manual     | 7100   | Shift allowance validation  |
      | Night_Shift_Allowance | automatic  |        | Night shift validation      |
      | Salary_Arrear         | manual     | 5555   | Salary arrear validation    |
      | Incentive             | manual     | 3005   | Incentive validation        |
    Then User extracts all Earning Head amounts, calculates the sum, and verifies it with Total Earning
    And User attaches the earning calculation breakdown to the cucumber report
    When User extracts all Deduction Head amounts, calculates the sum, and verifies it with Total Deduction
    And User attaches the deduction calculation breakdown to the cucumber report
    When User calculates Projected Net payable as Total Earning minus Total Deduction and verifies it with UI
    And User attaches the salary summary breakdown in a table format to the cucumber report