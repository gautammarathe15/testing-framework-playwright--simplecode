/**
 * MANUAL ATTENDANCE PAGE - Manual Attendance Entry
 * Tier 3 - Page Object Model Layer
 * Handles manual attendance entry and corrections
 */

const { BasePage } = require('../base.page');

class ManualAttendancePage extends BasePage {
    constructor(page) {
        super(page);
        
        // Manual Attendance Selectors
        this.manualMenu = '[data-testid="manual-attendance-menu"]';
        this.addAttendanceButton = 'button:has-text("Add Attendance")';
        this.employeeSelect = 'select[data-testid="employee"]';
        this.dateInput = 'input[type="date"][data-testid="attendance-date"]';
        this.checkInTimeInput = 'input[type="time"][data-testid="check-in"]';
        this.checkOutTimeInput = 'input[type="time"][data-testid="check-out"]';
        this.statusSelect = 'select[data-testid="status"]';
        this.remarksInput = 'textarea[placeholder="Remarks"]';
        this.saveButton = 'button:has-text("Save Attendance")';
        this.attendanceTable = 'table[data-testid="attendance-table"]';
        this.editButton = '[data-testid="edit-attendance"]';
        this.deleteButton = '[data-testid="delete-attendance"]';
        this.bulkUploadButton = 'button:has-text("Bulk Upload")';
    }

    /**
     * Navigate to Manual Attendance
     */
    async navigateToManualAttendance() {
        await this.click(this.manualMenu);
        await this.waitForPageLoad();
    }

    /**
     * Add manual attendance
     */
    async addManualAttendance(attendanceData) {
        await this.click(this.addAttendanceButton);
        await this.waitForElement(this.employeeSelect);
        
        await this.page.selectOption(this.employeeSelect, attendanceData.employeeId);
        await this.fill(this.dateInput, attendanceData.date);
        await this.fill(this.checkInTimeInput, attendanceData.checkInTime);
        await this.fill(this.checkOutTimeInput, attendanceData.checkOutTime);
        await this.page.selectOption(this.statusSelect, attendanceData.status);
        
        if (attendanceData.remarks) {
            await this.fill(this.remarksInput, attendanceData.remarks);
        }
        
        await this.click(this.saveButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all attendance records
     */
    async getAllAttendance() {
        await this.waitForElement(this.attendanceTable);
        return await this.getTableData();
    }

    /**
     * Edit attendance record
     */
    async editAttendanceRecord(recordId, newData) {
        const editBtn = `${this.tableRows}:has-text("${recordId}") ${this.editButton}`;
        await this.click(editBtn);
        await this.waitForElement(this.checkInTimeInput);
        
        if (newData.checkInTime) {
            await this.fill(this.checkInTimeInput, newData.checkInTime);
        }
        if (newData.checkOutTime) {
            await this.fill(this.checkOutTimeInput, newData.checkOutTime);
        }
        if (newData.status) {
            await this.page.selectOption(this.statusSelect, newData.status);
        }
        
        await this.click(this.saveButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Delete attendance record
     */
    async deleteAttendanceRecord(recordId) {
        const deleteBtn = `${this.tableRows}:has-text("${recordId}") ${this.deleteButton}`;
        await this.click(deleteBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Bulk upload attendance
     */
    async bulkUploadAttendance(filePath) {
        await this.click(this.bulkUploadButton);
        await this.page.setInputFiles('input[type="file"]', filePath);
        await this.click('button:has-text("Upload")');
        return await this.verifySuccessMessage();
    }
}

module.exports = { ManualAttendancePage };
