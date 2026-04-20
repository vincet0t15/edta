import { useEffect, useState } from 'react';

export type Appearance = 'light';

// Always remove dark mode (safe for SSR)
const applyTheme = () => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('dark');
};

// Initialize theme (call this once in app start)
export function initializeTheme() {
    if (typeof document === 'undefined') return;
    applyTheme();
}

// Hook
export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = () => {
        // force light only
        setAppearance('light');
        if (
            typeof window !== 'undefined' &&
            typeof window.localStorage !== 'undefined'
        ) {
            try {
                localStorage.setItem('appearance', 'light');
            } catch (e) {
                // ignore storage errors (e.g., private mode)
            }
        }
        applyTheme();
    };

    useEffect(() => {
        updateAppearance(); // always apply light on load
    }, []);

    return { appearance, updateAppearance };
}
