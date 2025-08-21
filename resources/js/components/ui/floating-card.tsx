import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FloatingCard({ 
  children, 
  className = "",
  delay = 0,
  direction = 'up'
}: FloatingCardProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 50, opacity: 0 };
      case 'down': return { y: -50, opacity: 0 };
      case 'left': return { x: 50, opacity: 0 };
      case 'right': return { x: -50, opacity: 0 };
      default: return { y: 50, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100",
        className
      )}
    >
      {children}
    </motion.div>
  );
}