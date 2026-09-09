@reporting_manager
Feature: Contractor Employee Reporting Manager Flow

  Scenario: Select, update, and compare reporting managers (M1, M2, and M3) sequentially within the same profile
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    And User verifies Aadhaar Card input field is visible
    And User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    And User fills mandatory Personal details with First Name "Raghav", Last Name "Sodhi", Gender "M", and DOB "10-Dec-1988"
    And User fills Contract Period details with Contract From "27-Aug-2025" and Contract Period In Days "90"
    And User fills all mandatory Deployment details with Subsidiary "A.k enterprise", Division "Sales", Department "Software", Category "Staff Employee", Grade "B", Designation "Jr Engineer", Location "Pune", Skilled Level "Semi-Skilled", and Contractor "GG ROOT"
    And User verifies default Status is "Active"
    And User clicks on the Save button
    And User clicks on OK button on success popup

    # --- Navigate to Employee Profile Once ---
    When User searches created employee status in grid by identity number
    And User clicks on Edit icon for the created employee
    And User clicks on "Reporting Manager" tab in employee profile

    # --- M1 Flow & Comparison (Initial Save) ---
    When User opens search popup for "M1"
    And User filters popup search with Subsidiary "A.k enterprise", Division "Sales", and Department "Software"
    And User selects the first employee from the search result grid
    And User clicks on Save button in Reporting Manager tab
    And User clicks on OK button on success popup
    Then User compares old details with updated details for "M1" and logs comparison chart in extent report

    # --- M2 Flow & Comparison (Update Flow) ---
    When User opens search popup for "M2"
    And User filters popup search with Subsidiary "A.k enterprise", Division "Testing", and Department "QA"
    And User selects the first employee from the search result grid
    And User clicks on Update button in Reporting Manager tab
    And User clicks on OK button on success popup
    Then User compares old details with updated details for "M2" and logs comparison chart in extent report

    # --- M3 Flow & Comparison (Update Flow) ---
    When User opens search popup for "M3"
    And User filters popup search with Subsidiary "A.k enterprise", Division "Development", and Department "Coding"
    And User selects the first employee from the search result grid
    And User clicks on Update button in Reporting Manager tab
    And User clicks on OK button on success popup
    Then User compares old details with updated details for "M3" and logs comparison chart in extent report

  Scenario: Update all reporting managers M1, M2 and M3 using employee codes
    # --- Navigate to Reporting Manager Tab if needed ---
      Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option
    When User clicks on the Create button
    And User verifies Aadhaar Card input field is visible
    And User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    And User fills mandatory Personal details with First Name "Raghav", Last Name "Sodhi", Gender "M", and DOB "10-Dec-1988"
    And User fills Contract Period details with Contract From "27-Aug-2025" and Contract Period In Days "90"
    And User fills all mandatory Deployment details with Subsidiary "A.k enterprise", Division "Sales", Department "Software", Category "Staff Employee", Grade "B", Designation "Jr Engineer", Location "Pune", Skilled Level "Semi-Skilled", and Contractor "GG ROOT"
    And User verifies default Status is "Active"
    And User clicks on the Save button
    And User clicks on OK button on success popup


        # --- Navigate to Employee Profile Once ---
    When User searches created employee status in grid by identity number
    And User clicks on Edit icon for the created employee
    And User clicks on "Reporting Manager" tab in employee profile

    # --- M1 Flow ---
    When User opens search popup for "M1"
    And User searches by Employee Code "234" in popup search
    And User stores first result details and clicks Select button
    And User clicks on Save button in Reporting Manager tab
    And User clicks on OK button on success popup

    # --- M2 Flow ---
    When User opens search popup for "M2"
    And User searches by Employee Code "1001" in popup search
    And User stores first result details and clicks Select button
    And User clicks on Update button in Reporting Manager tab
    And User clicks on OK button on success popup

    # --- M3 Flow ---
    When User opens search popup for "M3"
    And User searches by Employee Code "1003" in popup search
    And User stores first result details and clicks Select button
    And User clicks on Update button in Reporting Manager tab
    And User clicks on OK button on success popup