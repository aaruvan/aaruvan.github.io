import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TickerTooltipProps {
  onDismiss: () => void;
}

export const TickerTooltip = ({ onDismiss }: TickerTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if tooltip has been shown before
    const hasSeenTooltip = localStorage.getItem('hasSeenTickerTooltip');
    
    if (!hasSeenTooltip) {
      // Show tooltip after 1 second
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => {
        clearTimeout(showTimer);
      };
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenTickerTooltip', 'true');
    setTimeout(onDismiss, 300); // Wait for animation to finish
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute -top-16 left-0 z-50 w-56"
      >
        {/* Tooltip Content */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-2xl p-3 relative">
          <button
            onClick={handleDismiss}
            className="absolute -top-1 -right-1 p-0.5 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors shadow-md"
            aria-label="Dismiss tooltip"
          >
            <X className="w-2.5 h-2.5" />
          </button>
          
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              Click tickers to see live prices!
            </p>
          </div>
          
          {/* Arrow pointing down - using gradient to match */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 transform rotate-45" 
               style={{
                 background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                 clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
               }}>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

