
import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { SLA_HOURS_URGENT } from '../constants';

interface SLATimerProps {
  createdAt: string;
}

const SLATimer: React.FC<SLATimerProps> = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isBreached, setIsBreached] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(createdAt).getTime();
      const now = new Date().getTime();
      const deadline = start + SLA_HOURS_URGENT * 60 * 60 * 1000;
      const diff = deadline - now;

      if (diff <= 0) {
        setIsBreached(true);
        setTimeLeft('TERMINATED');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <div className={`flex items-center gap-5 px-8 py-3 rounded-[28px] border-2 animate-in fade-in zoom-in duration-700 shadow-2xl backdrop-blur-3xl ${
      isBreached 
      ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-rose-500/10' 
      : 'bg-[#04060c] text-blue-500 border-blue-600/20 shadow-black/50'
    }`}>
      {isBreached ? (
        <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
      ) : (
        <div className="relative">
          <Clock className="w-6 h-6 text-blue-500" />
          <div className="absolute inset-0 bg-blue-600/20 blur-lg rounded-full animate-pulse"></div>
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-1 leading-none">Response Window</span>
        <span className="text-xl font-mono font-black leading-none tracking-tighter">
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default SLATimer;
