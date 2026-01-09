
/**
 * Dual Portal Authentication Terminal
 * Implements a "Client Terminal" for external stakeholders and 
 * an "Internal Nexus" for departmental staff simulation.
 */
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Role, User } from '../types';
import Logo from '../components/Logo';
import { Mail, ChevronRight, ShieldCheck, User as UserIcon, Moon, Sun, Monitor, Globe, Shield, Triangle, Eye, Phone } from 'lucide-react';

const Auth: React.FC = () => {
  const { setCurrentUser, internalStaff } = useApp();
  const [portalType, setPortalType] = useState<'client' | 'internal'>('client');
  
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleClientAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientData.email || !clientData.name || !clientData.phone) return;

    const phoneClean = clientData.phone.replace(/\D/g, '');
    if (phoneClean.length !== 10) {
      alert("Please enter a valid 10-digit US phone number.");
      return;
    }

    const user: User = {
      id: `EXT-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
      name: clientData.name,
      email: clientData.email,
      phone: `+1${phoneClean}`,
      role: Role.CLIENT
    };

    localStorage.setItem('cts_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleInternalSwitch = (staff: User) => {
    localStorage.setItem('cts_user', JSON.stringify(staff));
    setCurrentUser(staff);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 relative overflow-hidden bg-[#12151e]">
      {/* Top Branding Bar */}
      <div className="w-full max-w-7xl flex justify-between items-center py-6 px-4 z-20">
        <div className="flex items-center gap-6 text-[11px] font-bold tracking-[0.4em] text-white/40 uppercase">
          <span className="cursor-default flex items-center gap-2">
            <Logo className="w-5 h-5 text-blue-600" />
            Vizva Infrastructures
          </span>
          <div className="w-[1px] h-4 bg-white/20"></div>
          <button className="hover:text-white/60 transition-colors">Governance</button>
        </div>
        <div className="flex items-center gap-6">
          <button className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 hover:bg-white/20 transition-all">Support Protocol</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center mt-10 mb-16 text-center z-10 animate-in fade-in duration-1000">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-blue-400 mb-6 animate-pulse">L-4 Authorization Required</p>
        <h1 className="text-[90px] font-black text-white tracking-tighter mb-4 leading-none vizva-text-gradient select-none">
          Vizva Access
        </h1>
        <p className="text-lg text-white/40 font-medium tracking-tight max-w-xl leading-relaxed">
          The next generation of governance and resolution infrastructure. <br />
          Enterprise-grade security for premium consultancy.
        </p>
      </div>

      {/* Login Interaction Grid */}
      <div className="w-full max-w-6xl z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        
        {/* Toggle Mechanism */}
        <div className="flex p-1.5 bg-[#1a1e2b]/80 rounded-2xl border border-white/10 mb-12 backdrop-blur-3xl shadow-2xl">
          <button 
            onClick={() => setPortalType('client')}
            className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${portalType === 'client' ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)]' : 'text-white/30 hover:text-white/60'}`}
          >
            Client Terminal
          </button>
          <button 
            onClick={() => setPortalType('internal')}
            className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${portalType === 'internal' ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)]' : 'text-white/30 hover:text-white/60'}`}
          >
            Internal Nexus
          </button>
        </div>

        {portalType === 'client' ? (
          /* Client Authorization Flow */
          <div className="w-full max-w-lg bg-[#1a1e2b]/95 border border-white/20 rounded-[40px] p-10 flex flex-col items-center shadow-[0_60px_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-700 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 mb-8 shadow-inner">
               <div className="relative">
                <Triangle className="w-6 h-6 text-blue-500/50" />
                <Eye className="w-3 h-3 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3" />
               </div>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-10 tracking-tight">Sign in to Vizva</h2>

            <form onSubmit={handleClientAuth} className="w-full space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.6em] text-white/50 ml-2">Full Legal Name</label>
                  <div className="relative group/input">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-blue-500 transition-colors" />
                    <input 
                      required 
                      type="text" 
                      value={clientData.name}
                      onChange={(e) => setClientData({...clientData, name: e.target.value})}
                      placeholder="John Doe" 
                      className="w-full bg-[#12151e] border border-white/10 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white outline-none focus:border-blue-600/50 transition-all placeholder:text-white/20 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.6em] text-white/50 ml-2">Stakeholder Identity (Gmail)</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-blue-500 transition-colors" />
                    <input 
                      required 
                      type="email" 
                      value={clientData.email}
                      onChange={(e) => setClientData({...clientData, email: e.target.value})}
                      placeholder="email@gmail.com" 
                      className="w-full bg-[#12151e] border border-white/10 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white outline-none focus:border-blue-600/50 transition-all placeholder:text-white/20 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.6em] text-white/50 ml-2">Secure Mobile (+1)</label>
                  <div className="relative group/input">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-blue-500 transition-colors" />
                    <input 
                      required 
                      type="tel" 
                      value={clientData.phone}
                      onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                      placeholder="555-0123-456" 
                      className="w-full bg-[#12151e] border border-white/10 rounded-[20px] pl-16 pr-8 py-5 text-sm text-white outline-none focus:border-blue-600/50 transition-all placeholder:text-white/20 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-5 rounded-[20px] bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.5em] hover:bg-blue-500 hover:shadow-[0_10px_40px_rgba(37,99,235,0.4)] transition-all shadow-xl active:scale-95">
                Initialize Session
              </button>
            </form>
          </div>
        ) : (
          /* Internal Staff Selection Nexus */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full animate-in zoom-in-95 duration-700">
            {internalStaff.map((staff) => (
              <button
                key={staff.id}
                onClick={() => handleInternalSwitch(staff)}
                className="bg-[#1a1e2b]/95 border border-white/10 rounded-[40px] p-10 text-left hover:border-blue-500/50 hover:bg-[#202638] transition-all group relative overflow-hidden active:scale-95 shadow-2xl flex flex-col justify-between min-h-[260px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/[0.1] blur-3xl pointer-events-none"></div>
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 rounded-[20px] bg-white/10 text-white/40 group-hover:text-blue-500 group-hover:bg-blue-600/10 transition-all duration-500 border border-white/10">
                    {staff.role === Role.COMPLIANCE ? <ShieldCheck className="w-7 h-7" /> : <UserIcon className="w-7 h-7" />}
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl tracking-tighter mb-2 leading-none group-hover:translate-x-1 transition-transform">{staff.name}</h3>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.5em] mb-6">Security L-4 Node</p>
                  {staff.department && (
                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_12px_#2563eb]"></div>
                        <span className="text-[9px] text-white/60 font-black uppercase tracking-widest">{staff.department} Division</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Global Footer Controls */}
        <div className="mt-20 flex flex-col items-center gap-10">
          <div className="flex p-1.5 bg-[#1a1e2b]/80 rounded-full border border-white/10 backdrop-blur-3xl shadow-2xl">
            <button className="p-3.5 rounded-full bg-white/10 text-blue-400 shadow-inner"><Moon className="w-4 h-4" /></button>
            <button className="p-3.5 rounded-full text-white/20 hover:text-white/40 transition-all"><Sun className="w-4 h-4" /></button>
            <button className="p-3.5 rounded-full text-white/20 hover:text-white/40 transition-all ml-1"><Monitor className="w-4 h-4" /></button>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/30">Synchronized Infrastructure Protocol</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
