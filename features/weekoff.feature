@weekoff @smoke
Feature: CLMS Employee Week Off Functionality Verification

  Background:
    Given User opens the CLMS login application page
    When User enters username "admin" and password "sa"
    And User clicks on the Login button
    And User clicks on the Contractor Employee menu option

  Scenario Outline: Verify Week Off tab elements and field visibility for a new employee
    When User clicks on the Create button
    And User verifies Aadhaar Card input field is visible
    And User enters dynamic valid Aadhaar number
    And User clicks on the Verify link if visible
    And User should see Submit and Skip Verification options and click Skip Verification
    And User fills mandatory Personal details with First Name "<FirstName>", Last Name "<LastName>", Gender "<Gender>", and DOB "<DOB>"
    And User fills Contract Period details with Contract From "<ContractFrom>" and Contract Period In Days "<ContractDays>"
    And User fills all mandatory Deployment details with Subsidiary "<Subsidiary>", Division "<Division>", Department "<Department>", Category "<Category>", Grade "<Grade>", Designation "<Designation>", Location "<Location>", Skilled Level "<SkilledLevel>", and Contractor "<Contractor>"
    And User verifies default Status is "Active"
    And User clicks on the Save button
    And User clicks on OK button on success popup

    When User searches created employee status in grid by identity number
    And User clicks on Edit icon for the created employee 

And User clicks on the Week Off tab
    Then User verifies "Week Off Default Applicable" checkbox and "Effective From" field are visible
    And User verifies "Week Off and Shift Template" dropdown is visible
    And User verifies "From Date" field is visible
    And User verifies "To Date" field is visible
    And On WeekOff Page User selects today's date in Effective From field
    When User clicks on the Update button for week off

    And User clicks on OK button on success popup



When User unchecks the "Week Off Default Applicable" checkbox
    And User enters "30-Sep-2026" in the Effective From field
    When User clicks on the Update button for week off
    And User clicks on OK button on success popup
    Then User verifies the first row in the table shows status "No" and effective date "30-Sep-2026"
    And User clicks on OK button on success popup
  
    And User selects the first template from the Week Off and Shift Template dropdown
    And User selects today date in From Date field
    And User selects date after 5 days from today in To Date field
    And User clicks on Save button for template
    And User clicks on OK button on success popup
    Then User verifies the table displays template expectedTemplate, expectedFromDate and expectedToDate
  


  # --- Negative Test Scenarios for Mandatory Fields ---
    
    # 1. Verify validation when 'Week Off and Shift Template' is empty
    When User leaves 'Week Off and Shift Template' dropdown empty
    And User selects today date in From Date field
    And User selects date after 5 days from today in To Date field
    And User clicks on Save button for template
    Then User should see validation popup or message for template selection
    And User clicks on OK button on success popup

    # 2. Verify validation when 'From Date' is empty
    When User selects the first template from the Week Off and Shift Template dropdown
    And User leaves 'From Date' field empty
    And User selects date after 5 days from today in To Date field
    And User clicks on Save button for template
    Then User should see validation popup or message for From Date
    And User clicks on OK button on success popup

    # 3. Verify validation when 'To Date' is empty
    When User selects the first template from the Week Off and Shift Template dropdown
    And User selects today date in From Date field
    And User leaves 'To Date' field empty
    And User clicks on Save button for template
    Then User should see validation popup or message for To Date
    And User clicks on OK button on success popup
  
  Examples:
      | FirstName | LastName | Gender | DOB         | ContractFrom | ContractDays | Subsidiary     | Division | Department | Category       | Grade | Designation | Location | SkilledLevel | Contractor |
      | Sirachand | Soni     | M      | 05-Jan-1890 | 01-Mar-2026  | 290          | A.k enterprise | Sales    | Software   | Staff Employee | B     | Jr Engineer | Pune     | Semi-Skilled | GG ROOT    |