import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS } from 'chart.js';

/**
 * ChartWrapper component that ensures proper Chart.js cleanup
 * Solves the "Canvas is already in use" error and DOM access issues
 */
const ChartWrapper = ({ children, id }) => {
  // Create refs to track component mount status and chart container
  const isMounted = useRef(false);
  const chartContainerRef = useRef(null);
  
  // Force a remount of the chart on every navigation
  const [mountId] = useState(`chart-${Math.random().toString(36).substring(2, 11)}`);
  const [isVisible, setIsVisible] = useState(false);
  
  // Generate a unique instanceId for this specific chart instance
  const instanceId = id || mountId;
  
  // Wait for the component to be properly mounted before rendering chart
  useEffect(() => {
    isMounted.current = true;
    
    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsVisible(true);
      }
    }, 50);
    
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      
      // Destroy all chart instances when component unmounts
      try {
        Object.values(ChartJS.instances).forEach(instance => {
          if (instance) {
            instance.destroy();
          }
        });
      } catch (err) {
        console.warn('Failed to destroy chart instances during cleanup', err);
      }
    };
  }, []);
  
  // Handle resize and visibility events safely
  useEffect(() => {
    if (!isVisible) return;
    
    const safelyDestroyCharts = () => {
      try {
        // Find charts associated with this component
        const chartsToDestroy = Object.values(ChartJS.instances).filter(instance => {
          return instance && instance.canvas && (
            instance.canvas.id === instanceId || 
            instance.id === instanceId || 
            instance.id === id
          );
        });
        
        // Safely destroy them
        chartsToDestroy.forEach(chart => {
          if (chart) chart.destroy();
        });
      } catch (err) {
        console.warn('Error during chart cleanup:', err);
      }
    };
    
    // When the tab becomes hidden, destroy charts to prevent DOM errors
    const handleVisibilityChange = () => {
      if (document.hidden) {
        safelyDestroyCharts();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      safelyDestroyCharts();
    };
  }, [isVisible, instanceId, id]);

  // Only render the chart when the component is visible
  return (
    <div 
      ref={chartContainerRef}
      className="chart-container" 
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {isVisible && (
        <div id={instanceId}>
          {React.cloneElement(React.Children.only(children), {
            key: instanceId,
            id: instanceId,
            // Add these safety options to prevent resize errors
            options: {
              ...(children.props.options || {}),
              responsive: true,
              maintainAspectRatio: true,
              resizeDelay: 100,
            }
          })}
        </div>
      )}
    </div>
  );
};

export default ChartWrapper;