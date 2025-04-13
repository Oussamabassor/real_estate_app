import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', linkTo = '/', showText = true }) {
  // Size variants
  const sizes = {
    sm: {
      container: 'h-8 w-8',
      icon: 'w-4 h-4',
      text: 'text-lg ml-1.5'
    },
    md: {
      container: 'h-10 w-10',
      icon: 'w-6 h-6',
      text: 'text-xl ml-2'
    },
    lg: {
      container: 'h-12 w-12',
      icon: 'w-7 h-7',
      text: 'text-2xl ml-2.5'
    }
  };

  const sizeClass = sizes[size] || sizes.md;

  // Create the logo content without any Link wrapper
  const logoContent = (
    <div className="flex items-center">
      <div className={`${sizeClass.container} bg-primary-600 rounded-lg flex items-center justify-center shadow-sm`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${sizeClass.icon} text-white`}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      {showText && (
        <span className={`${sizeClass.text} font-bold text-primary-800 tracking-wide`}>ORMVAH</span>
      )}
    </div>
  );

  // If linkTo is provided, wrap the content in a Link, otherwise just return the content
  return linkTo ? (
    <Link to={linkTo} className="flex items-center">
      {logoContent}
    </Link>
  ) : logoContent;
}