
import React from 'react';
import { DepartmentAssignment, AssignmentStatus, Role } from '../types';
import { useApp } from '../store/AppContext';
import { ASSIGNMENT_STATUS_COLORS } from '../constants';
import { UserCheck, Clock, CheckCircle2, MoreVertical, MapPin, Activity, UserPlus } from 'lucide-react';

interface Props {
  assignments: DepartmentAssignment[];
  canManage: boolean;
  ticketId: string;
}

const DepartmentAssignmentTable: React.FC<Props> = ({ assignments, canManage, ticketId }) => {
  const { updateAssignment, assignTeamLead, currentUser, internalStaff } = useApp();

  const handleStatusChange = (assignmentId: string, newStatus: AssignmentStatus) => {
    const reason = prompt("Enter reason for status change:");
    if (!reason) return;
    updateAssignment(ticketId, assignmentId, { status: newStatus }, reason);
  };

  const handleAssignTL = (assignmentId: string, tlId: string) => {
    const tl = internalStaff.find(s => s.id === tlId);
    if (!tl) return;
    assignTeamLead(ticketId, assignmentId, tlId, `Assigned to ${tl.name}`);
  };

  return (
    <div className="glass-premium rounded-[40px] overflow-hidden border border-white/10 bg-[#04060c]/40 shadow-2xl">
      <div className="p-10 border-b border-white/10 bg-white/[0.015] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Activity className="w-5 h-5 text-blue-500" />
          <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40">Parallel Resolution Protocol</h3>
        </div>
        <span className="text-[10px] font-black text-white/10 uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/5">{assignments.length} Node(s) Active</span>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/[0.005] text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">
            <th className="px-10 py-8">Division</th>
            <th className="px-10 py-8">Status Layer</th>
            <th className="px-10 py-8">Lead Authorization</th>
            {canManage && <th className="px-10 py-8 text-right">Synchronization</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {assignments.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-10 py-24 text-center">
                <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.5em] italic">No active divisions injected</p>
              </td>
            </tr>
          ) : (
            assignments.map((asgn) => {
              const assignedTL = internalStaff.find(s => s.id === asgn.team_lead_id);
              const availableTLs = internalStaff.filter(s => s.role === Role.TEAM_LEAD && s.department === asgn.department);
              const isDeptManagerForThis = currentUser?.role === Role.DEPT_MANAGER && currentUser.department === asgn.department;

              return (
                <tr key={asgn.id} className="hover:bg-blue-600/[0.02] transition-all group">
                  <td className="px-10 py-10">
                    <div className="flex flex-col">
                      <span className="text-white text-base font-black tracking-tighter mb-1.5 group-hover:text-blue-500 transition-colors">{asgn.department}</span>
                      {asgn.branch && (
                        <div className="flex items-center gap-2 text-[10px] text-blue-600 font-black uppercase tracking-widest">
                          <MapPin className="w-3 h-3" />
                          Node: {asgn.branch}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <span className={`inline-flex px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 ${ASSIGNMENT_STATUS_COLORS[asgn.status]}`}>
                      {asgn.status}
                    </span>
                  </td>
                  <td className="px-10 py-10">
                    {assignedTL ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20 shadow-lg">
                          <UserCheck className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white/60 tracking-tight leading-none mb-1">{assignedTL.name}</span>
                          <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">Active Lead</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {isDeptManagerForThis ? (
                          <div className="relative">
                            <select 
                              onChange={(e) => handleAssignTL(asgn.id, e.target.value)}
                              className="bg-[#12151e] border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:border-blue-500 transition-all appearance-none pr-10"
                            >
                              <option value="">Assign Lead</option>
                              {availableTLs.map(tl => <option key={tl.id} value={tl.id}>{tl.name}</option>)}
                            </select>
                            <UserPlus className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 opacity-20">
                            <Clock className="w-5 h-5 text-white/50" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Awaiting Lead</span>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  {canManage && (
                    <td className="px-10 py-10 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        {currentUser?.role === Role.TEAM_LEAD && asgn.team_lead_id === currentUser.id && asgn.status !== AssignmentStatus.RESOLVED && (
                          <button 
                            onClick={() => handleStatusChange(asgn.id, AssignmentStatus.RESOLVED)}
                            className="px-6 py-3 rounded-2xl bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-600/20 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all"
                          >
                            Commit Solve
                          </button>
                        )}
                        <button className="p-4 rounded-2xl bg-white/[0.02] text-white/20 hover:text-blue-500 hover:bg-white/5 border border-white/5 transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentAssignmentTable;
