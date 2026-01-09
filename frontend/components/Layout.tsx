
/**
 * Application Frame Logic
 * Handles sidebar navigation, authorization checks for nav items, 
 * and the main viewport layout.
 */
import React from 'react';
import { useApp } from '../store/AppContext';
import { Role } from '../types';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  Bell,
  Hexagon,
  Settings,
  UserCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, setCurrentUser } = useApp();

  const handleLogout = () => {
    localStorage.removeItem('cts_user');
    setCurrentUser(null);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.CLIENT, Role.COMPLIANCE, Role.DEPT_MANAGER, Role.TEAM_LEAD] },
    { id: 'tickets', label: 'My Tickets', icon: TicketIcon, roles: [Role.CLIENT] },
    { id: 'profile', label: 'Identity Profile', icon: UserCircle, roles: [Role.CLIENT] },
    { id: 'compliance', label: 'Compliance Queue', icon: ShieldCheck, roles: [Role.COMPLIANCE] },
  ];

  const filteredNav = navItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-[#12151e]">
      {/* Sidebar - Governance Control Panel */}
      <aside className="w-80 border-r border-white/10 flex flex-col fixed h-full z-40 bg-[#12151e] shadow-[10px_0_40px_rgba(0,0,0,0.4)]">
        <div className="p-10 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-600/20 shadow-xl">
              <Logo className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-white leading-none">VIZVA</span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1.5 opacity-90">Infrastructures</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-8 space-y-4">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] ml-4 mb-6">Core Console</p>
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white border border-blue-600/30 shadow-2xl' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-blue-500/50 group-hover:text-blue-500'}`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute left-[-1.5rem] w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_15px_#ffffff]"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Identity Box */}
        <div className="p-10">
          <div className="rounded-[40px] p-8 border border-white/10 relative overflow-hidden bg-[#1a1e2b] shadow-2xl">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white/60" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-white truncate leading-none mb-2">{currentUser?.name}</p>
                <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2 leading-none">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                   Authorized User
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <LogOut className="w-4 h-4" />
              Terminate
            </button>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 ml-80 p-16 relative z-10">
        <header className="flex justify-between items-start mb-24">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
               <Hexagon className="w-4 h-4 text-blue-600" />
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em]">Resolution Engine v4.2.0</span>
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter vizva-text-gradient">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-14">
            <div className="text-right flex flex-col items-end">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-black mb-3">Grid Resilience</p>
              <div className="flex items-center gap-4">
                 <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[99.98%] bg-blue-600 shadow-[0_0_15px_#2563eb] animate-bar-pulse"></div>
                 </div>
                 <p className="text-[11px] text-blue-500 font-black tracking-widest leading-none">99.98% OPTIMIZED</p>
              </div>
            </div>
            <div className="w-[1px] h-14 bg-white/20"></div>
            <div className="flex gap-4">
              <button className="w-16 h-16 rounded-[28px] glass-premium hover:bg-white/10 transition-all flex items-center justify-center relative shadow-2xl">
                <Bell className="w-7 h-7 text-white/50" />
                <span className="absolute top-5 right-5 w-3 h-3 bg-blue-600 rounded-full border-2 border-[#12151e]"></span>
              </button>
              <button className="w-16 h-16 rounded-[28px] glass-premium hover:bg-white/10 transition-all flex items-center justify-center shadow-2xl">
                <Settings className="w-7 h-7 text-white/50" />
              </button>
            </div>
          </div>
        </header>
        
        <div className="max-w-[1600px] mx-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
