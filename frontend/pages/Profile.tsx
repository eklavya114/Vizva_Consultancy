
/**
 * Identity & Security Terminal
 * Allows clients to update their authorized contact snapshots (Email/Phone).
 * Displays security context and verification status.
 */
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Mail, Phone, User as UserIcon, ShieldCheck, Database, Globe, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, updateUserProfile } = useApp();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate encryption & sync delay
    setTimeout(() => {
      updateUserProfile({ email, phone });
      setIsSaving(false);
      alert("Infrastructure credentials updated and synchronized successfully.");
    }, 800);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Identity Validation Header */}
      <div className="glass-premium rounded-[56px] p-12 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 rounded-[32px] bg-blue-500/10 flex items-center justify-center border border-white/5 shadow-2xl">
            <UserIcon className="w-12 h-12 text-blue-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter vizva-text-gradient uppercase leading-none mb-4">{currentUser.name}</h2>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Identity Profile Validated</span>
              <div className="w-[1px] h-4 bg-white/10"></div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Mode Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glass-premium rounded-[48px] p-12 space-y-10 border border-white/10">
          <div className="flex items-center gap-4">
            <Database className="w-6 h-6 text-blue-400" />
            <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em]">Core Credentials</h3>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-[32px] bg-[#1a1e2b] border border-white/5 shadow-inner">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-4">Authorized Email</p>
               <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-lg font-bold text-white tracking-tight outline-none border-b border-white/5 focus:border-blue-500 transition-all w-full"
                  />
               </div>
            </div>

            <div className="p-8 rounded-[32px] bg-[#1a1e2b] border border-white/5 shadow-inner">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-4">Localized Mobile (+1)</p>
               <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent text-lg font-bold text-white tracking-tight outline-none border-b border-white/5 focus:border-emerald-500 transition-all w-full"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Security Summary Panel */}
        <div className="glass-premium rounded-[48px] p-12 flex flex-col justify-between border border-white/10">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <Globe className="w-6 h-6 text-indigo-400" />
              <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em]">Security Context</h3>
            </div>
            <p className="text-base text-white/40 leading-relaxed font-medium">
              Your profile is synchronized with the L-4 governance layer. All changes to your identity credentials require multi-factor verification through our resolution engine.
            </p>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-6 rounded-[32px] bg-blue-600 text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Security Protocol
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
