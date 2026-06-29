// Imported required Cucumber hooks and assertion modules
const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Page Object Model reference for the isolated master module components
const { ContractorEmployeePage } = require('../../pages/mastermodule/contractorEmployee');

/**
 * STEP DEFINITION: Master Module Access Control Verification
 * This step isolation ensures that dashboard extension validations don't clutter the core authentication workflow.
 */
Then('User verifies availability of the Contractor Employee master option', async function() {
    /**
     * CORE FUNCTIONALITY POINT OF VIEW:
     * Instantiating the module driver by passing the runtime page context shared via Cucumber World
     */
    console.log("🔍 Verification Matrix: Evaluating Contractor Employee master option visibility...");
    
    // safe instantiation using the current running page session
    const contractorEmp = new ContractorEmployeePage(this.page || page);

    // Workflow Method 1: Expanding the structural 'Masters' drop-down directly on top menu
    const isVisibleViaMenu = await contractorEmp.validateViaMasterMenu();
    
    if (isVisibleViaMenu) {
        console.log("✅ Validation Passed: 'Contractor Employee' link verified successfully via top 'Masters' drop-down.");
    } else {
        // Fallback Strategy Method 2: Inspecting direct viewport dashboard tiles if navigation dropdown fails
        console.log("⚠️ Top-level menu expansion failed. Initiating fallback check directly on Dashboard area...");
        const isVisibleDirectly = await contractorEmp.validateDirectOnDashboard();
        
        if (!isVisibleDirectly) {
            throw new Error("❌ Access Matrix Error: 'Contractor Employee' master option is completely missing for this user role.");
        }
    }
});