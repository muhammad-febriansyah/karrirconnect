import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PulsatingButtonProps {
    children: ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    pulsateColor?: string;
    pulsateIntensity?: 'low' | 'medium' | 'high';
}

export function PulsatingButton({
    children,
    className = '',
    href,
    onClick,
    variant = 'default',
    size = 'md',
    disabled = false,
    pulsateColor = '#2347FA',
    pulsateIntensity = 'medium'
}: PulsatingButtonProps) {
    const intensityConfig = {
        low: {
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.6, 0.3],
            duration: 3
        },
        medium: {
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.8, 0.4],
            duration: 2
        },
        high: {
            scale: [1, 1.08, 1],
            opacity: [0.5, 1, 0.5],
            duration: 1.5
        }
    };

    const config = intensityConfig[pulsateIntensity];

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3 text-base'
    };

    const baseClasses = variant === 'default' 
        ? 'group relative overflow-hidden rounded-2xl font-semibold transition-all duration-500 ease-out text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-[#2347FA] hover:shadow-md hover:shadow-gray-200/30'
        : '';

    const ButtonComponent = () => (
        <Button
            variant={variant as any}
            className={`${baseClasses} ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{
                position: 'relative',
                zIndex: 1
            }}
        >
            {/* Pulsating background effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                    background: `radial-gradient(circle, ${pulsateColor}20 0%, transparent 70%)`,
                    zIndex: -1
                }}
                animate={{
                    scale: config.scale,
                    opacity: config.opacity
                }}
                transition={{
                    duration: config.duration,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            
            {/* Shimmer overlay on hover */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Pulsating ring effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl border-2"
                style={{
                    borderColor: pulsateColor,
                    zIndex: -2
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0, 0.3]
                }}
                transition={{
                    duration: config.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            />
            
            <span className="relative z-10">{children}</span>
        </Button>
    );

    if (href) {
        return (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href={href}>
                    <ButtonComponent />
                </a>
            </motion.div>
        );
    }

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ButtonComponent />
        </motion.div>
    );
}