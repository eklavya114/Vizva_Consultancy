
/**
 * Core Data Models & Enumerations
 * This file defines the strictly typed interfaces used throughout the 
 * Company Ticketing System (CTS).
 */

export enum Role {
  CLIENT = 'Client',
  COMPLIANCE = 'Compliance Manager', // The "Super Admin" role
  DEPT_MANAGER = 'Department Manager', // "Admin" of a specific division
  TEAM_LEAD = 'Team Lead' // Operational "User" role
}

export enum Department {
  RESUME = 'Resume',
  MARKETING = 'Marketing',
  TECHNICAL = 'Technical',
  SALES = 'Sales',
  COMPLIANCE = 'Compliance'
}

export enum MarketingBranch {
  AHM = 'AHM',
  LKO = 'LKO',
  GGR = 'GGR'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent' // Urgent tickets trigger the 4-hour SLA timer
}

export enum GlobalStatus {
  COMPLIANCE_REVIEW = 'In Compliance Review',
  WAITING_CLIENT = 'Waiting for Client',
  IN_RESOLUTION = 'In Resolution',
  READY_TO_CLOSE = 'Ready to Close',
  CLOSED = 'Closed'
}

export enum AssignmentStatus {
  NOT_ASSIGNED = 'Not Assigned',
  ASSIGNED = 'Assigned to Team Lead',
  IN_PROGRESS = 'In Progress',
  WAITING_CLIENT = 'Waiting for Client',
  RESOLVED = 'Resolved'
}

/** Represents a system user or client entity */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  department?: Department; // Scoped for staff members
  branch?: MarketingBranch; // Scoped for Marketing division
}

/** Represents a specific department task within a ticket resolution flow */
export interface DepartmentAssignment {
  id: string;
  ticket_id: string;
  department: Department;
  branch?: MarketingBranch;
  manager_id?: string;
  team_lead_id?: string;
  status: AssignmentStatus;
  resolved_at?: string;
  created_at: string;
}

/** The primary ticket data structure */
export interface Ticket {
  id: string; // TKT-XXXX
  reference_id: string; // REF-XXXX (used for sister ticket lineage)
  parent_ticket_id?: string;
  client_id: string;
  title: string;
  description: string;
  priority: Priority;
  status: GlobalStatus;
  reopen_count: number;
  warning_flag: boolean; // True if reopen_count > 1
  contact_email: string; // Captured snapshot at creation
  contact_phone: string; // Captured snapshot at creation (+1 prefix)
  created_at: string;
  updated_at: string;
  closed_at?: string;
  assignments: DepartmentAssignment[];
  email_notifications_enabled: boolean;
  subscribed_users: string[]; // User IDs opted into notifications
}

/** Audit event for chronological timeline forensics */
export interface AuditEvent {
  id: string;
  ticket_id: string;
  reference_id: string;
  type: string;
  actor_id: string;
  actor_role: Role;
  old_value?: any;
  new_value?: any;
  reason: string;
  created_at: string;
}

export interface Comment {
  id: string;
  ticket_id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}
