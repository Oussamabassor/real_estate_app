import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function Logo({ variant = 'light', className = '' }) {
    const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';
    const gradientFrom = variant === 'light' ? 'from-primary-500' : 'from-primary-600';
    const gradientTo = variant === 'light' ? 'to-primary-700' : 'to-primary-800';
    const hoverEffect = variant === 'light' ? 'hover:text-primary-200' : 'hover:text-primary-600';

    return (
        <Link
            to="/"
            className={`flex items-center gap-2 transition-all duration-300 ${className}`}
        >
            <div className="relative">
                <div className="absolute inset-0 blur-sm bg-gradient-to-r from-primary-500/50 to-primary-700/50 rounded-lg transform rotate-3"></div>
                <div className={`relative p-2 rounded-lg bg-gradient-to-r ${gradientFrom} ${gradientTo} shadow-lg`}>
                    <HomeIcon className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className="flex items-center">
                <span className={`text-2xl font-bold ${textColor}`}>Estate</span>
                <span className={`text-2xl font-light ${textColor}`}>Hub</span>
                <span className={`ml-1 text-sm font-medium bg-gradient-to-r ${gradientFrom} ${gradientTo} text-transparent bg-clip-text`}>
                    Premium
                </span>
            </div>
        </Link>
    );
}

Logo.propTypes = {
    variant: PropTypes.oneOf(['light', 'dark']),
    className: PropTypes.string
};