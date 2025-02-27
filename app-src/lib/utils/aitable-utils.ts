/**
 * Field definitions for Projects datasheet
 */
export const PROJECT_FIELDS = {
  NAME: 'Name',
  DESCRIPTION: 'Description',
  STATUS: 'Status',
  PRIORITY: 'Priority',
  START_DATE: 'Start Date',
  DUE_DATE: 'Due Date',
  BUDGET: 'Budget',
  MANAGER: 'Manager',
  DEPARTMENT: 'Department',
};

/**
 * Field definitions for Tasks datasheet
 */
export const TASK_FIELDS = {
  TITLE: 'Title',
  DESCRIPTION: 'Description',
  PROJECT: 'Project',
  ASSIGNEE: 'Assignee',
  STATUS: 'Status',
  PRIORITY: 'Priority',
  DUE_DATE: 'Due Date',
  ESTIMATED_HOURS: 'Estimated Hours',
  ACTUAL_HOURS: 'Actual Hours',
  ATTACHMENTS: 'Attachments',
};

/**
 * Project status options
 */
export const PROJECT_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
};

/**
 * Project priority options
 */
export const PROJECT_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

/**
 * Task status options
 */
export const TASK_STATUS = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
};

/**
 * Task priority options
 */
export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

/**
 * Format a linked record for AITable
 * @param recordId - Record ID to link to
 * @returns Formatted linked record array
 */
export function formatLinkedRecord(recordId: string | null | undefined) {
  if (!recordId) return null;
  return [{ recordId }];
}

/**
 * Extract record ID from a linked record
 * @param linkedRecord - Linked record from AITable
 * @returns Record ID or null if not found
 */
export function extractLinkedRecordId(linkedRecord: any) {
  if (!linkedRecord || !Array.isArray(linkedRecord) || linkedRecord.length === 0) {
    return null;
  }
  return linkedRecord[0].recordId;
}

/**
 * Format date for AITable (ISO string)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | null | undefined) {
  if (!date) return null;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
} 