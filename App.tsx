
import React, { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import ComplianceQueue from './components/ComplianceQueue';
import WorkQueue from './components/WorkQueue';
import ReportsDashboard from './components/ReportsDashboard';
import ClientTicketList from './components/ClientTicketList';
import Profile from './pages/Profile';
import { Priority, Role } from './types';
import { Plus, X, ShieldAlert, Database, Mail, Phone, ChevronRight, Zap } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, addTicket } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newTicketForm, setNewTicketForm] = useState({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    phone: ''
  });

  if (!currentUser) {
    return <Auth />;
  }

  const handleTicketClick = (id: string) => {
    setSelectedTicketId(id);
    setActiveTab('ticket-detail');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneClean = newTicketForm.phone.replace(/\D/g, '');
    if (phoneClean.length !== 10) {
      alert("Please enter a valid 10-digit USA phone number.");
      return;
    }

    addTicket({
      title: newTicketForm.title,
      description: newTicketForm.description,
      priority: newTicketForm.priority,
      client_id: currentUser.id,
      contact_email: currentUser.email,
      contact_phone: `+1${phoneClean}`
    });
    setShowCreateModal(false);
    setNewTicketForm({ title: '', description: '', priority: Priority.MEDIUM, phone: '' });
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <Dashboard 
          onTicketClick={handleTicketClick} 
          onNewTicket={() => setShowCreateModal(true)} 
        />
      )}
      
      {activeTab === 'ticket-detail' && selectedTicketId && (
        <TicketDetail 
          ticketId={selectedTicketId} 
          onBack={() => setActiveTab('dashboard')} 
        />
      )}

      {activeTab === 'compliance' && (
        <ComplianceQueue onTicketClick={handleTicketClick} />
      )}

      {activeTab === 'assignments' && (
        <WorkQueue onTicketClick={handleTicketClick} />
      )}

      {activeTab === 'reports' && (
        <ReportsDashboard />
      )}

      {activeTab === 'tickets' && (
        <ClientTicketList onTicketClick={handleTicketClick} />
      )}

      {activeTab === 'profile' && (
        <Profile />
      )}

      {/* Premium Forensic Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="glass-premium max-w-2xl w-full rounded-[64px] p-20 border border-blue-600/20 shadow-[0_60px_120px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-700 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-12 right-12 w-12 h-12 rounded-2xl glass hover:bg-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all border border-white/5"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-5 mb-12">
              <div className="w-14 h-14 rounded-3xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                <Plus className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter vizva-text-gradient uppercase leading-none">Initialize engagement</h2>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.6em] mt-3">Establishing secure request record</p>
              </div>
            </div>
            
            <form onSubmit={handleCreateTicket} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] ml-2 block">Case Title</label>
                <div className="relative group">
                  <Database className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    required
                    type="text" 
                    value={newTicketForm.title}
                    onChange={(e) => setNewTicketForm({...newTicketForm, title: e.target.value})}
                    className="w-full bg-[#020308] border border-white/10 rounded-[24px] pl-16 pr-8 py-5 text-sm text-white outline-none focus:border-blue-600/30 transition-all font-bold placeholder:text-white/5 shadow-inner"
                    placeholder="Summarize core issue..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] ml-2 block">Incident Description</label>
                <textarea 
                  required
                  rows={4}
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({...newTicketForm, description: e.target.value})}
                  className="w-full bg-[#020308] border border-white/10 rounded-[24px] px-8 py-6 text-sm text-white outline-none focus:border-blue-600/30 transition-all font-medium resize-none shadow-inner placeholder:text-white/5"
                  placeholder="Provide technical details, context, and impact..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] ml-2 block">Authorized Contact (+1)</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      required
                      type="tel" 
                      value={newTicketForm.phone}
                      onChange={(e) => setNewTicketForm({...newTicketForm, phone: e.target.value})}
                      className="w-full bg-[#020308] border border-white/10 rounded-[24px] pl-16 pr-8 py-5 text-sm text-white outline-none focus:border-blue-600/30 transition-all font-bold placeholder:text-white/5 shadow-inner"
                      placeholder="e.g. 5550123456"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] ml-2 block">Urgency Protocol</label>
                  <select 
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({...newTicketForm, priority: e.target.value as Priority})}
                    className="w-full bg-[#020308] border border-white/10 rounded-[24px] px-8 py-5 text-sm text-white outline-none focus:border-blue-600/30 transition-all font-bold appearance-none shadow-inner"
                  >
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p} Priority</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-8 flex gap-6">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-6 rounded-[32px] border border-white/5 text-white/20 font-black uppercase tracking-[0.4em] text-[10px] hover:text-white hover:bg-white/5 transition-all shadow-xl"
                >
                  Discard Record
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-6 rounded-[32px] bg-blue-700 text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-[0_25px_50px_rgba(37,99,235,0.3)] hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Zap className="w-4 h-4" />
                  Finalize engagement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
