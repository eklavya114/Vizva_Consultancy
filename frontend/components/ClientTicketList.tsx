
/**
 * Personalized Request Ledger
 * Displays a historical list of tickets created by the logged-in client.
 * Features search and status filtering protocols.
 */
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Ticket as TicketIcon, Filter, ChevronRight, Clock } from 'lucide-react';
import { STATUS_COLORS } from '../constants';

interface Props {
  onTicketClick: (id: string) => void;
}

const ClientTicketList: React.FC<Props> = ({ onTicketClick }) => {
  const { tickets, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const myTickets = tickets.filter(t => 
    t.client_id === currentUser?.id && 
    (t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      {/* Ledger Header */}
      <div className="glass-premium rounded-[48px] p-10 flex items-center gap-8 border border-white/10">
        <div className="w-16 h-16 rounded-[20px] bg-blue-600/5 border border-blue-600/10 flex items-center justify-center shadow-2xl">
          <TicketIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-4">
            Request Ledger
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-white/10 uppercase tracking-[0.5em]">
              Personal Resolution History
            </span>
            <div className="px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-[10px] font-black text-blue-500 uppercase tracking-widest">
              {myTickets.length} Manifests
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Data Grid */}
      <div className="glass-premium rounded-[56px] overflow-hidden border border-white/10 flex flex-col min-h-[600px] shadow-[0_60px_120px_rgba(0,0,0,1)]">
        <div className="p-10 flex items-center justify-between gap-10 bg-white/[0.01]">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search request records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md bg-[#02040a] border border-white/[0.1] rounded-full px-8 py-5 text-sm text-white outline-none focus:border-blue-600/30 transition-all placeholder:text-white/5 shadow-inner"
            />
          </div>
          <button className="w-14 h-14 rounded-full bg-[#02040a] border border-white/[0.1] flex items-center justify-center text-white/10 hover:text-blue-500 hover:border-blue-600/30 transition-all shadow-xl group">
            <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="h-[1px] w-full bg-white/[0.05]"></div>

        <div className="flex-1 flex flex-col bg-black/20">
          {myTickets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-20">
              <p className="text-2xl font-black text-white/[0.04] uppercase tracking-[0.6em] italic text-center select-none">
                No engagement records identified
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {myTickets.map((t) => (
                <div 
                  key={t.id} 
                  className="px-14 py-12 group hover:bg-blue-600/[0.03] transition-all cursor-pointer flex items-center justify-between border-b border-white/[0.02]"
                  onClick={() => onTicketClick(t.id)}
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-6 mb-3">
                      <span className="text-xl font-black text-white tracking-tighter group-hover:text-blue-500 transition-colors">{t.id}</span>
                      <span className="text-[11px] font-mono font-bold text-white/10 uppercase tracking-[0.4em]">{t.reference_id}</span>
                    </div>
                    <span className="text-base text-white/30 font-medium truncate max-w-2xl block tracking-tight group-hover:text-white/50 transition-colors">
                      {t.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="flex flex-col items-end gap-3">
                       <span className={`inline-flex px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 ${STATUS_COLORS[t.status]}`}>
                          {t.status}
                       </span>
                       <div className="flex items-center gap-2 text-white/10">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString()}</span>
                       </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 text-white/5 flex items-center justify-center group-hover:text-blue-500 group-hover:bg-blue-600/10 group-hover:border-blue-600/20 transition-all shadow-xl">
                      <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientTicketList;
