import React from 'react';
import PropTypes from 'prop-types';

/**
 * A wrapper component for charts that provides consistent height and styling
 */
const ChartWrapper = ({ children, height = 300 }) => {
  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

ChartWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number
};

export default ChartWrapper;