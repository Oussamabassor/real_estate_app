import React from 'react';

export default function LogoIcon({ size = 40 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Primary background */}
      <rect width="40" height="40" rx="8" fill="#0f2c5c"/>
      
      {/* Abstract building/property icon */}
      <path 
        d="M12 28V14L20 8L28 14V28H23V21H17V28H12Z" 
        fill="#c8a55b"
      />
      
      {/* Modern window elements */}
      <rect x="17" y="14" width="6" height="4" fill="#ffffff" fillOpacity="0.7"/>
    </svg>
  );
}
