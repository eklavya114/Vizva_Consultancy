
import React from 'react';
import { useApp } from '../store/AppContext';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, Activity, Globe, Database } from 'lucide-react';

const ReportsDashboard: React.FC = () => {
  const { tickets } = useApp();

  const total = tickets.length;
  const closed = tickets.filter(t => t.status === 'Closed').length;
  const urgent = tickets.filter(t => t.priority === 'Urgent').length;
  const warning = tickets.filter(t => t.warning_flag).length;

  const stats = [
    { label: 'Global Throughput', value: total, icon: Globe, color: 'text-sky-400' },
    { label: 'Successful Closure', value: closed, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Critical Protocol', value: urgent, icon: AlertCircle, color: 'text-rose-400' },
    { label: 'Context Breaches', value: warning, icon: ShieldCheck, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="glass-premium rounded-[56px] p-12 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between bg-emerald-500/[0.01]">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-[28px] bg-emerald-500/10 flex items-center justify-center border border-white/5 shadow-2xl">
            <BarChart3 className="w-10 h-10 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter vizva-text-gradient uppercase leading-none mb-4">Forensic Analytics</h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em]">Infrastructure optimization metrics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass-premium rounded-[48px] p-10 relative overflow-hidden group border border-white/5 hover:border-white/10 transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-all ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-6xl font-black text-white tracking-tighter mb-2 leading-none">{stat.value}</p>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-premium rounded-[56px] p-12 bg-black/30 border border-white/5">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-6 h-6 text-sky-400" />
              <h3 className="text-xl font-black text-white tracking-tight">Resolution Velocity</h3>
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">+12.4% Optimal</span>
          </div>
          
          <div className="space-y-8">
            {['Technical', 'Marketing', 'Resume', 'Sales'].map((dept, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span>{dept} Division</span>
                  <span className="text-sky-400">{85 - i * 5}%</span>
                </div>
                <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-[0_0_10px_#0ea5e988]" 
                    style={{ width: `${85 - i * 5}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-premium rounded-[56px] p-12 bg-black/30 border border-white/5">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Activity className="w-6 h-6 text-rose-400" />
              <h3 className="text-xl font-black text-white tracking-tight">SLA Health Matrix</h3>
            </div>
            <span className="text-[10px] font-black text-rose-400/50 uppercase tracking-widest">Live Monitoring</span>
          </div>

          <div className="flex flex-col gap-6">
             <div className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Database className="w-6 h-6 text-emerald-400" />
                   </div>
                   <div>
                      <p className="text-sm font-black text-white mb-1">Grid Uptime</p>
                      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Synchronized</p>
                   </div>
                </div>
                <span className="text-2xl font-black text-white font-mono">99.9%</span>
             </div>
             
             <div className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-rose-400" />
                   </div>
                   <div>
                      <p className="text-sm font-black text-white mb-1">MTTR Velocity</p>
                      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Averaging 2.4h</p>
                   </div>
                </div>
                <span className="text-2xl font-black text-white font-mono">2.4h</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
