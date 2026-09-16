import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  message?: string;
  className?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  message = 'Photo loaded successfully',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#181A1B] text-white text-xs font-medium tracking-wide shadow-sm ${className}`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 24,
          delay: 0.05,
        }}
        className="w-4 h-4 rounded-full bg-[#C85A17] flex items-center justify-center text-white shrink-0"
      >
        <Check className="w-2.5 h-2.5 stroke-[3]" />
      </motion.div>
      <span className="leading-none">{message}</span>
    </motion.div>
  );
};
