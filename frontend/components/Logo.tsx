
import React from 'react';

/**
 * Vizva Identity Logo
 * A stylized SVG representing the premium nature of the consultancy.
 */
const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]">
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" fill="white" fillOpacity="0.05" />
      <path d="M50 25L75 70H25L50 25Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
    </svg>
  </div>
);

export default Logo;
