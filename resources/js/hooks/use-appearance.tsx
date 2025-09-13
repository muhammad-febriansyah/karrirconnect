import { useState, useEffect } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredAppearance(): Appearance {
    if (typeof window !== 'undefined') {
        return (localStorage.getItem('appearance') as Appearance) || 'system';
    }
    return 'system';
}

export function initializeTheme() {
    const storedAppearance = getStoredAppearance();
    const theme = storedAppearance === 'system' ? getSystemTheme() : storedAppearance;
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>(getStoredAppearance);

    const updateAppearance = (newAppearance: Appearance) => {
        setAppearance(newAppearance);
        localStorage.setItem('appearance', newAppearance);
        
        const theme = newAppearance === 'system' ? getSystemTheme() : newAppearance;
        
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            if (appearance === 'system') {
                const theme = getSystemTheme();
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [appearance]);

    return { appearance, updateAppearance } as const;
}
