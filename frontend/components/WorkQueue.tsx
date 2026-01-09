
/**
 * Departmental Work Center
 * Displays tickets assigned to the current user's department and branch.
 * Only accessible to Internal Staff roles.
 */
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Role, AssignmentStatus } from '../types';
import { FileSearch, Search, Filter, ChevronRight, MapPin } from 'lucide-react';
import { STATUS_COLORS, ASSIGNMENT_STATUS_COLORS } from '../constants';

interface Props {
  onTicketClick: (id: string) => void;
}

const WorkQueue: React.FC<Props> = ({ onTicketClick }) => {
  const { tickets, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const workTickets = tickets.filter(t => {
    if (!currentUser || currentUser.role === Role.CLIENT || currentUser.role === Role.COMPLIANCE) return false;
    
    return t.assignments.some(a => {
      const isCorrectDept = a.department === currentUser.department;
      const isCorrectBranch = !a.branch || !currentUser.branch || a.branch === currentUser.branch;
      return isCorrectDept && isCorrectBranch;
    }) && (t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.title.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="glass-premium rounded-[56px] p-12 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between bg-sky-500/[0.02]">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-[28px] bg-sky-500/10 flex items-center justify-center border border-white/5 shadow-2xl">
            <FileSearch className="w-10 h-10 text-sky-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter vizva-text-gradient uppercase leading-none mb-4">{currentUser?.department} Division</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-sky-400/60 uppercase tracking-[0.4em]">
                <MapPin className="w-3.5 h-3.5" />
                Node: {currentUser?.branch || 'Universal'}
              </div>
              <div className="w-[1px] h-4 bg-white/10"></div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{workTickets.length} Active Contexts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-premium rounded-[64px] overflow-hidden">
        <div className="p-10 border-b border-white/5 flex items-center justify-between gap-8 bg-black/20">
          <div className="relative max-w-xl w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-sky-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter division queue..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#04060c] border border-white/5 rounded-full pl-18 pr-8 py-5 text-sm text-white outline-none focus:border-white/10 transition-all shadow-inner"
            />
          </div>
          <button className="w-14 h-14 rounded-full bg-[#04060c] border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all shadow-xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.03] bg-white/[0.005]">
                <th className="px-14 py-8 text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Entity ID</th>
                <th className="px-14 py-8 text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Request Summary</th>
                <th className="px-14 py-8 text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Node Status</th>
                <th className="px-14 py-8 text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Global layer</th>
                <th className="px-14 py-8 text-right text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {workTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-14 py-32 text-center">
                    <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.6em] italic">No departmental tasks currently allocated</p>
                  </td>
                </tr>
              ) : (
                workTickets.map((t) => {
                  const myAsgn = t.assignments.find(a => a.department === currentUser?.department);
                  return (
                    <tr 
                      key={t.id} 
                      className="group hover:bg-white/[0.015] transition-all cursor-pointer"
                      onClick={() => onTicketClick(t.id)}
                    >
                      <td className="px-14 py-12">
                        <span className="text-base font-black text-white tracking-tighter">{t.id}</span>
                      </td>
                      <td className="px-14 py-12">
                        <span className="text-sm text-white/40 font-medium truncate max-w-sm block tracking-tight">{t.title}</span>
                      </td>
                      <td className="px-14 py-12">
                        <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 shadow-sm ${ASSIGNMENT_STATUS_COLORS[myAsgn?.status || AssignmentStatus.NOT_ASSIGNED]}`}>
                          {myAsgn?.status}
                        </span>
                      </td>
                      <td className="px-14 py-12">
                        <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 shadow-sm ${STATUS_COLORS[t.status]}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-14 py-12 text-right">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 text-white/10 flex items-center justify-center group-hover:text-white group-hover:bg-white/5 group-hover:border-white/10 transition-all shadow-xl">
                          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkQueue;
