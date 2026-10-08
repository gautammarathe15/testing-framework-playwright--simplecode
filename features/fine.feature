@fine_

Feature: Employee Fine Management

  Background:

    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    And User enters "91312" in search filter for Aadhaar or employee details
    And User selects the 1st entry from the employee grid
     Given User clicks on the Fine Option menu
    And User clicks on the create disciplinary option

  Scenario: 1 . Verify validation when Date of Offence is missing
    # Date of Offence omit keli ahe
    And User selects Code of Misconduct as Failure to Act
    And User fills the Code of Misconduct details as "Late arrival and negligence"
    And User enters Action taken as MR. MARATHE
    And User selects the current month in ForMonth
    When User clicks on the Save Disciplinary Action button
    Then User should see the validation popup with message "Fill all mandatory fields with appropriate data"

  Scenario:  . Verify validation when Code of Misconduct is missing
    And User extracts date from employee to date and sets it as Date of Offence
    # Code of Misconduct omit kelela ahe
    And User fills the Code of Misconduct details as "Late arrival and negligence"
    And User enters Action taken as MR. MARATHE
    And User selects the current month in ForMonth
    When User clicks on the Save Disciplinary Action button
    Then User should see the validation popup with message "Fill all mandatory fields with appropriate data"

  Scenario:2. Verify validation when Action Taken is missing
    And User extracts date from employee to date and sets it as Date of Offence
    And User selects Code of Misconduct as Failure to Act
    And User fills the Code of Misconduct details as "Late arrival and negligence"
    # Action Taken blank thevla ahe
    And User selects the current month in ForMonth
    When User clicks on the Save Disciplinary Action button
    Then User should see the validation popup with message "Fill all mandatory fields with appropriate data"



    Scenario: 3. Verify successful creation of Employee Disciplinary Action with all mandatory details
    And User extracts date from employee to date and sets it as Date of Offence
    And User selects Code of Misconduct as Failure to Act
    And User fills the Code of Misconduct details as "Failure to complete assigned task on time"
    And User enters Action taken as MR. MARATHE
    And User selects the current month in ForMonth
    When User clicks on the Save Disciplinary Action button
    Then User should see successful disciplinary record saved or success message

@fulldone_

    Scenario: 4. Verify successful creation of Employee Disciplinary Action with all mandatory details
    And User extracts date from employee to date and sets it as Date of Offence
    And User selects Code of Misconduct as Failure to Act
    And User fills the Code of Misconduct details as "Failure to complete assigned task on time"
    And User enters Action taken as MR. MARATHE
    And User selects the current month in ForMonth
    When User clicks on the Save Disciplinary Action button
    Then User clicks on OK button on the success popup
    And User should see the saved entry with issue "Failure to complete assigned task on time" and action taken "MR. MARATHE" in the disciplinary table