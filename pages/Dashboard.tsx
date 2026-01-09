
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Role, GlobalStatus, Priority } from '../types';
import Logo from '../components/Logo';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Activity,
  Lock,
  Hexagon
} from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

interface Props {
  onTicketClick: (id: string) => void;
  onNewTicket: () => void;
}

const Dashboard: React.FC<Props> = ({ onTicketClick, onNewTicket }) => {
  const { tickets, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(t => {
    if (currentUser?.role === Role.CLIENT) {
      if (t.client_id !== currentUser.id) return false;
    } 
    else if (currentUser?.role === Role.DEPT_MANAGER || currentUser?.role === Role.TEAM_LEAD) {
       const relevantAssignments = t.assignments.filter(a => {
         const isCorrectDept = a.department === currentUser.department;
         const isCorrectBranch = !a.branch || !currentUser.branch || a.branch === currentUser.branch;
         return isCorrectDept && isCorrectBranch;
       });
       if (relevantAssignments.length === 0) return false;
    }
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.reference_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = [
    { label: 'ACTIVE CONTEXTS', value: filteredTickets.filter(t => t.status !== GlobalStatus.CLOSED).length, icon: Clock, color: 'text-blue-500', active: true },
    { label: 'CRITICAL PROTOCOL', value: filteredTickets.filter(t => t.priority === Priority.URGENT && t.status !== GlobalStatus.CLOSED).length, icon: AlertTriangle, color: 'text-rose-400' },
    { label: 'SYSTEM SUCCESS', value: filteredTickets.filter(t => t.status === GlobalStatus.CLOSED).length, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'COMPLIANCE REVIEW', value: filteredTickets.filter(t => t.status === GlobalStatus.COMPLIANCE_REVIEW).length, icon: History, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Welcome Section */}
      <div className="rounded-[40px] border border-white/20 p-12 bg-[#1a1e2b]/80 shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center justify-between group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/[0.1] blur-[100px] pointer-events-none"></div>
        <div className="flex items-center gap-10 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shadow-[0_0_35px_rgba(37,99,235,0.3)]">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)] border-2 border-white/20">
                <Logo className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Governance Profile Active</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4">
              Welcome, {currentUser?.name}
            </h2>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-600/20 border border-blue-600/40 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div>
              <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">{currentUser?.role}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 mt-8 lg:mt-0 relative z-10">
          <div className="text-right">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.5em] mb-1">Authorization Scope</p>
            <p className="text-sm text-blue-400 font-black uppercase tracking-[0.2em] flex items-center justify-end gap-2">
              <ShieldCheck className="w-5 h-5" />
              L-4 Secure Access
            </p>
          </div>
          <div className="w-16 h-16 rounded-[24px] border border-white/20 flex items-center justify-center bg-white/10">
            <Lock className="w-8 h-8 text-white/30" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`glass-premium rounded-[40px] p-10 relative overflow-hidden flex flex-col group transition-all duration-500 hover:border-blue-600/50 ${stat.active ? 'border-blue-600/40 bg-blue-600/[0.08]' : 'border-white/20'}`}
          >
            <div className="flex justify-between items-start mb-12">
              <div className={`p-4 rounded-2xl bg-white/10 border border-white/20 ${stat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon className="w-7 h-7" />
              </div>
              {stat.active && <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>}
            </div>
            <p className="text-7xl font-black text-white tracking-tighter mb-4">{stat.value}</p>
            <p className="text-[11px] text-white/50 font-black uppercase tracking-[0.4em]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Container Section */}
      <div className="glass-premium rounded-[48px] overflow-hidden border border-white/20 shadow-[0_60px_100px_rgba(0,0,0,0.6)] bg-[#1a1e2b]/95">
        <div className="p-10 border-b border-white/10 flex flex-wrap items-center justify-between gap-6 bg-white/5">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Synchronize request identity..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#12151e] border border-white/20 rounded-full pl-14 pr-6 py-4 text-sm text-white outline-none focus:border-blue-600/60 transition-all font-medium placeholder:text-white/30"
              />
            </div>
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          {currentUser?.role === Role.CLIENT && (
            <button 
              onClick={onNewTicket}
              className="px-10 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-blue-500 hover:shadow-[0_10px_40px_rgba(37,99,235,0.4)] transition-all shadow-2xl flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              New Engagement
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-12 py-7 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Identity</th>
                <th className="px-12 py-7 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Status</th>
                <th className="px-12 py-7 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Priority</th>
                <th className="px-12 py-7 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Nodes</th>
                <th className="px-12 py-7 text-right text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-12 py-24 text-center">
                    <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.5em] italic">Zero active contexts</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr 
                    key={t.id} 
                    className="group hover:bg-blue-600/10 transition-all cursor-pointer border-b border-white/5"
                    onClick={() => onTicketClick(t.id)}
                  >
                    <td className="px-12 py-10">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-base font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">{t.id}</span>
                          <span className="text-[11px] font-bold text-white/30 uppercase font-mono tracking-widest">{t.reference_id}</span>
                          {t.warning_flag && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_12px_#ef4444]"></div>}
                        </div>
                        <span className="text-sm text-white/70 font-medium truncate max-w-sm tracking-tight">{t.title}</span>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <span className={`inline-flex px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-sm ${STATUS_COLORS[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-12 py-10">
                      <span className={`inline-flex px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-sm ${PRIORITY_COLORS[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex -space-x-3">
                        {t.assignments.length === 0 ? (
                          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                            <Clock className="w-5 h-5 text-white/30" />
                          </div>
                        ) : (
                          t.assignments.map((a, i) => (
                            <div 
                              key={i} 
                              className="w-12 h-12 rounded-full bg-[#1a1e2b] border-2 border-[#12151e] flex items-center justify-center text-[11px] font-black text-blue-400 shadow-2xl"
                            >
                              {a.department[0]}
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-12 py-10 text-right">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-white/40 flex items-center justify-center group-hover:text-blue-400 group-hover:bg-blue-600/20 group-hover:border-blue-600/40 transition-all ml-auto shadow-xl">
                        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
