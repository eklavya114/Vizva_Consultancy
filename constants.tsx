
import { Priority, GlobalStatus, AssignmentStatus, Role, Department, MarketingBranch } from './types';

export const SLA_HOURS_URGENT = 4;
export const PHONE_PREFIX = '+1';

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  [Priority.MEDIUM]: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  [Priority.HIGH]: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  [Priority.URGENT]: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

export const STATUS_COLORS: Record<GlobalStatus, string> = {
  [GlobalStatus.COMPLIANCE_REVIEW]: 'bg-indigo-500/20 text-indigo-300',
  [GlobalStatus.WAITING_CLIENT]: 'bg-amber-500/20 text-amber-300',
  [GlobalStatus.IN_RESOLUTION]: 'bg-blue-500/20 text-blue-300',
  [GlobalStatus.READY_TO_CLOSE]: 'bg-emerald-500/20 text-emerald-300',
  [GlobalStatus.CLOSED]: 'bg-gray-500/20 text-gray-400',
};

export const ASSIGNMENT_STATUS_COLORS: Record<AssignmentStatus, string> = {
  [AssignmentStatus.NOT_ASSIGNED]: 'bg-gray-500/20 text-gray-400',
  [AssignmentStatus.ASSIGNED]: 'bg-blue-500/20 text-blue-300',
  [AssignmentStatus.IN_PROGRESS]: 'bg-indigo-500/20 text-indigo-300',
  [AssignmentStatus.WAITING_CLIENT]: 'bg-amber-500/20 text-amber-300',
  [AssignmentStatus.RESOLVED]: 'bg-emerald-500/20 text-emerald-300',
};
