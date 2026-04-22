import React from 'react';
import { motion } from 'motion/react';

export const RainOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-20">
      {/* Simulation of rain streaks using many small divs */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, x: Math.random() * 100 + '%' }}
          animate={{ y: '110vh' }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2,
          }}
          className="absolute w-[1px] h-[40px] bg-gradient-to-b from-transparent via-white/50 to-transparent"
        />
      ))}
      
      {/* Background rumble/flash simulation could be added here */}
      <motion.div
        animate={{ opacity: [0, 0.05, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 1] }}
        className="absolute inset-0 bg-white"
      />
    </div>
  );
};
