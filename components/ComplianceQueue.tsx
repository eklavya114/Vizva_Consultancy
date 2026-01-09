
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { GlobalStatus, Priority } from '../types';
import { ShieldCheck, Search, Filter, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

interface Props {
  onTicketClick: (id: string) => void;
}

const ComplianceQueue: React.FC<Props> = ({ onTicketClick }) => {
  const { tickets } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const complianceTickets = tickets.filter(t => 
    t.status === GlobalStatus.COMPLIANCE_REVIEW && 
    (t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="glass-premium rounded-[56px] p-12 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between bg-indigo-500/[0.02]">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-[28px] bg-indigo-500/10 flex items-center justify-center border border-white/5 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter vizva-text-gradient uppercase leading-none mb-4">Triage Protocol</h2>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">Awaiting division injection</span>
              <div className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black text-indigo-400/80 uppercase tracking-widest">{complianceTickets.length} Pending</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-premium rounded-[64px] overflow-hidden">
        <div className="p-10 border-b border-white/5 flex items-center justify-between gap-8 bg-black/20">
          <div className="relative max-w-xl w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search compliance manifests..." 
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
                <th className="px-14 py-8 text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Incident ID</th>
                <th className="px-14 py-8 text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Subject context</th>
                <th className="px-14 py-8 text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Priority rating</th>
                <th className="px-14 py-8 text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Temporal age</th>
                <th className="px-14 py-8 text-right text-[10px] font-black text-white/10 uppercase tracking-[0.6em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {complianceTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-14 py-32 text-center">
                    <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.6em] italic">Queue empty: All contexts synchronized</p>
                  </td>
                </tr>
              ) : (
                complianceTickets.map((t) => (
                  <tr 
                    key={t.id} 
                    className="group hover:bg-white/[0.015] transition-all cursor-pointer"
                    onClick={() => onTicketClick(t.id)}
                  >
                    <td className="px-14 py-10">
                      <span className="text-base font-black text-white tracking-tighter">{t.id}</span>
                    </td>
                    <td className="px-14 py-10">
                      <span className="text-sm text-white/40 font-medium truncate max-w-sm block tracking-tight">{t.title}</span>
                    </td>
                    <td className="px-14 py-10">
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 shadow-sm ${PRIORITY_COLORS[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-14 py-10">
                      <div className="flex items-center gap-2 text-white/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">{new Date(t.created_at).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-14 py-10 text-right">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 text-white/10 flex items-center justify-center group-hover:text-white group-hover:bg-white/5 group-hover:border-white/10 transition-all shadow-xl">
                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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

export default ComplianceQueue;
