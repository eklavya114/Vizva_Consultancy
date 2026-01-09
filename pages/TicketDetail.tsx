
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  GlobalStatus, 
  Priority, 
  Role, 
  Department, 
  MarketingBranch, 
  AssignmentStatus 
} from '../types';
import { 
  ArrowLeft, 
  AlertCircle, 
  History, 
  MessageSquare, 
  Mail, 
  CheckCircle,
  Plus,
  ShieldAlert,
  MoreHorizontal,
  ChevronRight,
  User,
  Phone,
  Calendar,
  Activity,
  Layers,
  Settings,
  Database,
  Lock,
  Share2,
  Send,
  Zap,
  RefreshCw,
  Bell,
  BellOff
} from 'lucide-react';
import SLATimer from '../components/SLATimer';
import DepartmentAssignmentTable from '../components/DepartmentAssignmentTable';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

interface Props {
  ticketId: string;
  onBack: () => void;
}

const TicketDetail: React.FC<Props> = ({ ticketId, onBack }) => {
  const { tickets, auditLogs, currentUser, updateTicketStatus, updateTicketPriority, updateTicketContact, toggleTicketSubscription, addDepartmentAssignment, reopenTicket } = useApp();
  const ticket = tickets.find(t => t.id === ticketId);
  const lineage = tickets.filter(t => t.reference_id === ticket?.reference_id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const logs = auditLogs.filter(log => log.ticket_id === ticketId);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | ''>('');
  const [selectedBranch, setSelectedBranch] = useState<MarketingBranch | ''>('');
  const [commentText, setCommentText] = useState('');

  const [comments, setComments] = useState<any[]>([
    { id: '1', user: 'System Bot', text: 'Ticket synchronized with division L-4.', time: new Date().toISOString() }
  ]);

  if (!ticket) return <div className="p-24 text-center text-white/20 font-black uppercase tracking-[0.5em]">Forensic Record Null</div>;

  const isSubscribed = currentUser ? ticket.subscribed_users?.includes(currentUser.id) : false;
  const canChangePriority = currentUser?.role === Role.COMPLIANCE || currentUser?.role === Role.DEPT_MANAGER;

  const handleAssignDept = () => {
    if (!selectedDept) return;
    if (selectedDept === Department.MARKETING && !selectedBranch) {
      alert("Marketing branch selection is mandatory");
      return;
    }
    addDepartmentAssignment(ticket.id, selectedDept as Department, selectedBranch as MarketingBranch);
    setShowAssignModal(false);
    setSelectedDept('');
    setSelectedBranch('');
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as Priority;
    const reason = prompt("Reason for priority update:");
    if (!reason) return;
    updateTicketPriority(ticket.id, newPriority, reason);
  };

  const handleCloseTicket = () => {
    const reason = prompt("Enter final closure reason:");
    if (!reason) return;
    updateTicketStatus(ticket.id, GlobalStatus.CLOSED, reason);
  };

  const handleReopen = () => {
    const reason = prompt("Enter reason for reopening:");
    if (!reason) return;
    reopenTicket(ticket.id, reason);
    onBack(); 
  };

  const handleUpdateSnapshot = () => {
    const newEmail = prompt("Update Contact Email Snapshot:", ticket.contact_email);
    const newPhone = prompt("Update Contact Phone Snapshot (+1):", ticket.contact_phone);
    if (!newEmail || !newPhone) return;
    updateTicketContact(ticket.id, newEmail, newPhone, "Client updated contact snapshot");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, {
      id: Date.now().toString(),
      user: currentUser?.name || 'Anonymous',
      text: commentText,
      time: new Date().toISOString()
    }]);
    setCommentText('');
  };

  return (
    <div className="space-y-12 pb-32 animate-in slide-in-from-bottom-8 duration-1000">
      {/* Precision Forensic Header */}
      <div className="glass-premium p-12 rounded-[56px] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden bg-[#1e2332]/90">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/[0.05] blur-[80px] pointer-events-none"></div>
        <div className="flex items-center gap-10">
          <button onClick={onBack} className="w-16 h-16 rounded-[24px] bg-white/[0.05] hover:bg-blue-600/10 text-white/40 hover:text-blue-500 transition-all group flex items-center justify-center shadow-xl border border-white/10">
            <ArrowLeft className="w-7 h-7 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="w-[1px] h-16 bg-white/10 hidden sm:block"></div>
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none vizva-text-gradient">{ticket.id}</h2>
              <div className="px-4 py-1.5 rounded-xl bg-blue-600/10 text-[10px] font-black text-blue-400 tracking-[0.3em] border border-blue-600/20 uppercase">Ref: {ticket.reference_id}</div>
              {ticket.warning_flag && (
                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-rose-600/10 text-rose-500 border border-rose-600/20 shadow-[0_0_15px_rgba(225,29,72,0.1)]">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Context Breach Detected</span>
                </div>
              )}
            </div>
            <p className="text-xl text-white/60 font-medium tracking-tight leading-relaxed">{ticket.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => toggleTicketSubscription(ticket.id)}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border transition-all shadow-xl ${
              isSubscribed 
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
              : 'bg-white/5 text-white/30 border-white/10'
            }`}
          >
            {isSubscribed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            {isSubscribed ? 'Subscribed' : 'Get Alerts'}
          </button>

          {ticket.priority === Priority.URGENT && ticket.status !== GlobalStatus.CLOSED && (
            <SLATimer createdAt={ticket.created_at} />
          )}
          <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-2xl ${STATUS_COLORS[ticket.status]}`}>
            {ticket.status}
          </div>
          
          {canChangePriority ? (
            <select 
              value={ticket.priority} 
              onChange={handlePriorityChange}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border shadow-2xl outline-none appearance-none cursor-pointer bg-[#1e2332] border-white/10 ${PRIORITY_COLORS[ticket.priority]}`}
            >
              {Object.values(Priority).map(p => <option key={p} value={p}>{p} Priority</option>)}
            </select>
          ) : (
            <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-2xl ${PRIORITY_COLORS[ticket.priority]}`}>
              {ticket.priority} Priority
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          <div className="glass-premium rounded-[56px] p-16 relative overflow-hidden bg-[#1e2332]/80 border border-white/10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/[0.02] blur-[150px] rounded-full"></div>
            
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-inner">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Incident Manifest</h3>
              </div>
              <div className="bg-[#12151e]/80 p-12 rounded-[40px] border border-white/10 shadow-inner relative group">
                <p className="text-2xl text-white/80 leading-relaxed font-medium italic tracking-tight">
                  "{ticket.description}"
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-inner">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Parallel Resolution Nodes</h3>
                </div>
                {currentUser?.role === Role.COMPLIANCE && ticket.status !== GlobalStatus.CLOSED && (
                  <button 
                    onClick={() => setShowAssignModal(true)}
                    className="px-8 py-4 bg-blue-700/80 hover:bg-blue-600 border border-blue-600/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3 transition-all shadow-xl"
                  >
                    <Plus className="w-4 h-4" />
                    Inject Department
                  </button>
                )}
              </div>
              <DepartmentAssignmentTable 
                assignments={ticket.assignments} 
                canManage={currentUser?.role !== Role.CLIENT}
                ticketId={ticket.id}
              />
            </div>
          </div>

          <div className="glass-premium rounded-[56px] p-16 space-y-10 border border-white/10 bg-[#1e2332]/80">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-inner">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Technical Discourse</h3>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-6 animate-in slide-in-from-left-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#12151e] border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-6 h-6 text-blue-400/30" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">{c.user}</span>
                      <span className="text-[9px] font-mono text-white/20">{new Date(c.time).toLocaleTimeString()}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 p-5 rounded-[24px] text-sm text-white/70 leading-relaxed tracking-tight shadow-inner">
                      {c.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="relative pt-6">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Synchronize technical note..."
                className="w-full bg-[#12151e] border border-white/10 rounded-[24px] pl-8 pr-20 py-5 text-sm text-white outline-none focus:border-blue-600/40 transition-all placeholder:text-white/20 shadow-inner"
              />
              <button 
                type="submit"
                className="absolute right-3 top-[32px] w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="glass-premium rounded-[56px] overflow-hidden border border-white/10 bg-[#1e2332]/80">
            <div className="p-12 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <History className="w-8 h-8 text-blue-500/40" />
                <h3 className="font-black text-2xl text-white tracking-tighter vizva-text-gradient">Timeline Forensics</h3>
              </div>
              <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em]">System Audit Validated</span>
            </div>
            <div className="p-16 space-y-16 max-h-[700px] overflow-y-auto custom-scrollbar bg-black/10">
              {logs.length === 0 ? (
                 <p className="text-center py-10 text-[12px] font-black text-white/20 uppercase tracking-[0.5em] italic">Initializing event stream...</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="relative pl-20 group">
                    <div className="absolute left-0 top-1 w-12 h-12 rounded-[18px] bg-[#12151e] border border-white/10 flex items-center justify-center z-10 group-hover:border-blue-600/30 transition-all shadow-2xl">
                       <Database className="w-5 h-5 text-white/20 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="absolute left-6 top-12 bottom-[-64px] w-[1px] bg-white/[0.05] group-last:hidden"></div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-[11px] text-white/40 font-black uppercase tracking-[0.3em]">
                        <span className="text-blue-400 font-bold">{log.type.replace(/_/g, ' ')}</span>
                        <span>/</span>
                        <span className="font-mono">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-xl text-white/70 font-medium leading-relaxed tracking-tight group-hover:text-white transition-colors">{log.reason}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="glass-premium rounded-[48px] p-10 border border-white/10 bg-[#1e2332]/80">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.6em]">Contextual Meta</h3>
              {currentUser?.role === Role.CLIENT && ticket.status !== GlobalStatus.CLOSED && (
                <button 
                  onClick={handleUpdateSnapshot}
                  className="p-2 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  title="Update Contact Snapshot"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-8">
              {[
                { label: 'Corporate Sync', val: ticket.contact_email, icon: Mail, color: 'text-blue-400' },
                { label: 'Encrypted Line', val: ticket.contact_phone, icon: Phone, color: 'text-emerald-400' },
                { label: 'Temporal Origin', val: new Date(ticket.created_at).toLocaleDateString(), icon: Calendar, color: 'text-blue-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className={`w-14 h-14 rounded-2xl bg-[#12151e] border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] mb-2">{item.label}</p>
                    <p className="text-sm text-white/80 font-bold truncate tracking-tight">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-premium rounded-[48px] overflow-hidden shadow-2xl border border-white/10 bg-[#1e2332]/80">
            <div className="p-8 bg-white/[0.02] border-b border-white/10">
              <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em]">Forensic History</h3>
            </div>
            <div className="divide-y divide-white/[0.05] bg-black/10">
              {lineage.map((t) => (
                <div 
                  key={t.id} 
                  className={`p-8 hover:bg-blue-600/[0.05] transition-all flex items-center justify-between group cursor-pointer ${t.id === ticketId ? 'bg-blue-600/[0.1] border-l-4 border-blue-600' : ''}`}
                >
                  <div className="flex flex-col">
                    <span className="text-base font-black text-white tracking-tighter leading-none mb-2">{t.id}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-blue-500"></div>
                      <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t.status}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {currentUser?.role === Role.COMPLIANCE && ticket.status === GlobalStatus.READY_TO_CLOSE && (
              <button 
                onClick={handleCloseTicket}
                className="w-full flex items-center justify-center gap-4 py-8 rounded-[40px] bg-emerald-700/80 text-white font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_30px_60px_rgba(16,185,129,0.2)] hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all group border border-emerald-500/30"
              >
                <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Finalize Closure
              </button>
            )}
            {currentUser?.role === Role.CLIENT && ticket.status === GlobalStatus.CLOSED && (
              <button 
                onClick={handleReopen}
                className="w-full flex items-center justify-center gap-4 py-8 rounded-[40px] bg-rose-700/80 text-white font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_30px_60px_rgba(190,18,60,0.2)] hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all group border border-rose-500/30"
              >
                <ShieldAlert className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Initiate Reopen
              </button>
            )}
          </div>
        </div>
      </div>
      
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="glass-premium max-w-xl w-full rounded-[64px] p-20 border border-blue-600/30 shadow-[0_60px_120px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-700 relative overflow-hidden bg-[#1e2332]">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
            
            <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                  <Plus className="w-6 h-6 text-blue-500" />
               </div>
               <h3 className="text-4xl font-black text-white tracking-tighter vizva-text-gradient leading-none uppercase">Initialize Node</h3>
            </div>
            
            <div className="space-y-10">
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase mb-5 block tracking-[0.6em] ml-2">Sector Target</label>
                <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value as Department)}
                    className="w-full bg-[#12151e] border border-white/20 rounded-[28px] px-8 py-6 text-white text-base outline-none appearance-none shadow-inner font-bold focus:border-blue-600/60"
                  >
                    <option value="" className="bg-[#12151e]">-- Primary Division --</option>
                    {Object.values(Department).filter(d => d !== Department.COMPLIANCE).map(d => (
                      <option key={d} value={d} className="bg-[#12151e]">{d}</option>
                    ))}
                </select>
              </div>

              {selectedDept === Department.MARKETING && (
                <div className="animate-in slide-in-from-top-6 duration-700">
                  <label className="text-[11px] font-black text-white/30 uppercase mb-5 block tracking-[0.6em] ml-2">Branch Verification</label>
                  <select 
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value as MarketingBranch)}
                      className="w-full bg-[#12151e] border border-white/20 rounded-[28px] px-8 py-6 text-white text-base outline-none appearance-none shadow-inner font-bold focus:border-blue-600/60"
                    >
                      <option value="" className="bg-[#12151e]">-- Select Regional Node --</option>
                      {Object.values(MarketingBranch).map(b => (
                        <option key={b} value={b} className="bg-[#12151e]">{b}</option>
                      ))}
                  </select>
                </div>
              )}

              <div className="flex gap-6 pt-10">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 py-6 rounded-[32px] border border-white/10 text-[11px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white hover:bg-white/5 transition-all"
                >
                  Terminate
                </button>
                <button 
                  onClick={handleAssignDept}
                  disabled={!selectedDept || (selectedDept === Department.MARKETING && !selectedBranch)}
                  className="flex-1 py-6 rounded-[32px] bg-blue-700 text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:bg-blue-600 hover:scale-[1.03] active:scale-95 transition-all"
                >
                  Validate Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
