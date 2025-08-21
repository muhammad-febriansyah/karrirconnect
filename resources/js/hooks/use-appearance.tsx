export type Appearance = 'light';

export function initializeTheme() {
    // Force light theme only
    document.documentElement.classList.remove('dark');
}

export function useAppearance() {
    const appearance: Appearance = 'light';

    const updateAppearance = () => {
        // No-op: only light theme available
        document.documentElement.classList.remove('dark');
    };

    return { appearance, updateAppearance } as const;
}
