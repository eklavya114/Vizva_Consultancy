
export enum Role {
  CLIENT = 'Client',
  COMPLIANCE = 'Compliance Manager',
  DEPT_MANAGER = 'Department Manager',
  TEAM_LEAD = 'Team Lead'
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
  URGENT = 'Urgent'
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  department?: Department;
  branch?: MarketingBranch;
}

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

export interface Ticket {
  id: string;
  reference_id: string;
  parent_ticket_id?: string;
  client_id: string;
  title: string;
  description: string;
  priority: Priority;
  status: GlobalStatus;
  reopen_count: number;
  warning_flag: boolean;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  assignments: DepartmentAssignment[];
  email_notifications_enabled: boolean;
  subscribed_users: string[]; // List of user IDs who have opted into email updates for this ticket
}

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
