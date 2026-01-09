
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Ticket, Role, Department, Priority, GlobalStatus, AssignmentStatus, AuditEvent, MarketingBranch, DepartmentAssignment } from '../types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  tickets: Ticket[];
  auditLogs: AuditEvent[];
  // Fix: Omit status and email_notifications_enabled as they are set internally inside addTicket implementation
  addTicket: (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'reopen_count' | 'warning_flag' | 'assignments' | 'reference_id' | 'subscribed_users' | 'status' | 'email_notifications_enabled'>) => void;
  updateTicketStatus: (ticketId: string, status: GlobalStatus, reason: string) => void;
  updateTicketPriority: (ticketId: string, priority: Priority, reason: string) => void;
  updateTicketContact: (ticketId: string, email: string, phone: string, reason: string) => void;
  updateAssignment: (ticketId: string, assignmentId: string, updates: Partial<DepartmentAssignment>, reason: string) => void;
  assignTeamLead: (ticketId: string, assignmentId: string, teamLeadId: string, reason: string) => void;
  reopenTicket: (ticketId: string, reason: string) => void;
  toggleTicketSubscription: (ticketId: string) => void;
  addDepartmentAssignment: (ticketId: string, dept: Department, branch?: MarketingBranch, reason?: string) => void;
  internalStaff: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const HARDCODED_STAFF: User[] = [
  { id: 's1', name: 'Sarah Admin', email: 'sarah@cts.com', phone: '+10000000001', role: Role.COMPLIANCE },
  { id: 's2', name: 'Amit Manager', email: 'amit@cts.com', phone: '+10000000002', role: Role.DEPT_MANAGER, department: Department.MARKETING, branch: MarketingBranch.AHM },
  { id: 's3', name: 'Lina Manager', email: 'lina@cts.com', phone: '+10000000003', role: Role.DEPT_MANAGER, department: Department.MARKETING, branch: MarketingBranch.LKO },
  { id: 's4', name: 'Kevin Tech', email: 'kevin@cts.com', phone: '+10000000004', role: Role.DEPT_MANAGER, department: Department.TECHNICAL },
  { id: 's5', name: 'Raj TeamLead', email: 'raj@cts.com', phone: '+10000000005', role: Role.TEAM_LEAD, department: Department.TECHNICAL },
  { id: 's6', name: 'Elena Manager', email: 'elena@cts.com', phone: '+10000000006', role: Role.DEPT_MANAGER, department: Department.RESUME },
  { id: 's7', name: 'Sam Lead', email: 'sam@cts.com', phone: '+10000000007', role: Role.TEAM_LEAD, department: Department.RESUME },
  { id: 's8', name: 'Victor Manager', email: 'victor@cts.com', phone: '+10000000008', role: Role.DEPT_MANAGER, department: Department.SALES },
  { id: 's9', name: 'John Lead', email: 'john@cts.com', phone: '+10000000009', role: Role.TEAM_LEAD, department: Department.SALES },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cts_user');
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('cts_user', JSON.stringify(updated));
  };

  const logEvent = useCallback((ticketId: string, refId: string, type: string, oldVal: any, newVal: any, reason: string) => {
    const event: AuditEvent = {
      id: Math.random().toString(36).substr(2, 9),
      ticket_id: ticketId,
      reference_id: refId,
      type,
      actor_id: currentUser?.id || 'system',
      actor_role: currentUser?.role || Role.CLIENT,
      old_value: oldVal,
      new_value: newVal,
      reason,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [event, ...prev]);
  }, [currentUser]);

  // Fix: Properly typed addTicket implementation to align with the Omit pattern
  const addTicket = (data: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'reopen_count' | 'warning_flag' | 'assignments' | 'reference_id' | 'subscribed_users' | 'status' | 'email_notifications_enabled'>) => {
    const id = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const refId = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      ...data,
      id,
      reference_id: refId,
      reopen_count: 0,
      warning_flag: false,
      assignments: [],
      status: GlobalStatus.COMPLIANCE_REVIEW,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_notifications_enabled: true,
      subscribed_users: currentUser ? [currentUser.id] : []
    };
    setTickets(prev => [newTicket, ...prev]);
    logEvent(id, refId, 'TICKET_CREATED', null, newTicket, 'Initial creation');
  };

  const toggleTicketSubscription = (ticketId: string) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const isSubscribed = t.subscribed_users.includes(currentUser.id);
        const newSubscribers = isSubscribed 
          ? t.subscribed_users.filter(id => id !== currentUser.id)
          : [...t.subscribed_users, currentUser.id];
        
        logEvent(ticketId, t.reference_id, 'SUBSCRIPTION_TOGGLED', isSubscribed, !isSubscribed, `User ${isSubscribed ? 'unsubscribed' : 'subscribed'} to updates`);
        return { ...t, subscribed_users: newSubscribers, updated_at: new Date().toISOString() };
      }
      return t;
    }));
  };

  const addDepartmentAssignment = (ticketId: string, dept: Department, branch?: MarketingBranch, reason = 'Department added by compliance') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const assignment: DepartmentAssignment = {
          id: `ASGN-${Math.random().toString(36).substr(2, 5)}`,
          ticket_id: ticketId,
          department: dept,
          branch,
          status: AssignmentStatus.NOT_ASSIGNED,
          created_at: new Date().toISOString()
        };
        const updated = { ...t, assignments: [...t.assignments, assignment], status: GlobalStatus.IN_RESOLUTION, updated_at: new Date().toISOString() };
        logEvent(ticketId, t.reference_id, 'DEPT_ASSIGNED', t.assignments, updated.assignments, reason);
        return updated;
      }
      return t;
    }));
  };

  const updateTicketStatus = (ticketId: string, status: GlobalStatus, reason: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const oldStatus = t.status;
        const updated = { ...t, status, updated_at: new Date().toISOString() };
        logEvent(ticketId, t.reference_id, 'GLOBAL_STATUS_CHANGED', oldStatus, status, reason);
        return updated;
      }
      return t;
    }));
  };

  const updateTicketPriority = (ticketId: string, priority: Priority, reason: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const oldPriority = t.priority;
        const updated = { ...t, priority, updated_at: new Date().toISOString() };
        logEvent(ticketId, t.reference_id, 'PRIORITY_CHANGED', oldPriority, priority, reason);
        return updated;
      }
      return t;
    }));
  };

  const updateTicketContact = (ticketId: string, email: string, phone: string, reason: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const oldVal = { email: t.contact_email, phone: t.contact_phone };
        const updated = { ...t, contact_email: email, contact_phone: phone, updated_at: new Date().toISOString() };
        logEvent(ticketId, t.reference_id, 'CONTACT_INFO_UPDATED', oldVal, { email, phone }, reason);
        return updated;
      }
      return t;
    }));
  };

  const updateAssignment = (ticketId: string, assignmentId: string, updates: Partial<DepartmentAssignment>, reason: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const oldAssignments = [...t.assignments];
        const newAssignments = t.assignments.map(a => a.id === assignmentId ? { ...a, ...updates } : a);
        
        const allResolved = newAssignments.length > 0 && newAssignments.every(a => a.status === AssignmentStatus.RESOLVED);
        let newGlobalStatus = t.status;
        if (allResolved && t.status !== GlobalStatus.CLOSED) {
          newGlobalStatus = GlobalStatus.READY_TO_CLOSE;
        }

        const updated = { ...t, assignments: newAssignments, status: newGlobalStatus, updated_at: new Date().toISOString() };
        logEvent(ticketId, t.reference_id, 'ASSIGNMENT_UPDATED', oldAssignments, newAssignments, reason);
        return updated;
      }
      return t;
    }));
  };

  const assignTeamLead = (ticketId: string, assignmentId: string, teamLeadId: string, reason: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newAssignments = t.assignments.map(a => 
          a.id === assignmentId ? { ...a, team_lead_id: teamLeadId, status: AssignmentStatus.ASSIGNED } : a
        );
        const updated = { ...t, assignments: newAssignments, updated_at: new Date().toISOString() };
        logEvent(ticketId, t.reference_id, 'TEAM_LEAD_ASSIGNED', teamLeadId, teamLeadId, reason);
        return updated;
      }
      return t;
    }));
  };

  const reopenTicket = (ticketId: string, reason: string) => {
    const parentTicket = tickets.find(t => t.id === ticketId);
    if (!parentTicket) return;

    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCount = parentTicket.reopen_count + 1;
    const isWarning = newCount > 1;

    const newTicket: Ticket = {
      ...parentTicket,
      id: newId,
      parent_ticket_id: ticketId,
      status: GlobalStatus.COMPLIANCE_REVIEW,
      reopen_count: newCount,
      warning_flag: isWarning,
      assignments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      closed_at: undefined,
      subscribed_users: currentUser ? [currentUser.id] : []
    };

    setTickets(prev => [newTicket, ...prev]);
    logEvent(newId, parentTicket.reference_id, 'TICKET_REOPENED', parentTicket.id, newId, reason);
    if (isWarning) {
      logEvent(newId, parentTicket.reference_id, 'WARNING_FLAG_TRIGGERED', false, true, 'Reopen count > 1');
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, setCurrentUser, updateUserProfile, tickets, auditLogs, addTicket, 
      updateTicketStatus, updateTicketPriority, updateTicketContact, updateAssignment, assignTeamLead, reopenTicket, toggleTicketSubscription, addDepartmentAssignment,
      internalStaff: HARDCODED_STAFF
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
