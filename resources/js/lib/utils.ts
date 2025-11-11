import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function resolveAssetUrl(path?: string | null, fallback = ''): string {
    if (typeof path === 'string') {
        const trimmed = path.trim();
        if (trimmed.length > 0) {
            const isExternal = /^(?:https?:)?\/\//i.test(trimmed);
            const isDataUri = trimmed.startsWith('data:');
            const isAbsolute = trimmed.startsWith('/');

            if (isExternal || isDataUri || isAbsolute) {
                return trimmed;
            }

            const normalized = trimmed.replace(/^\/+/, '').replace(/^storage\//, '');
            return `/storage/${normalized}`;
        }
    }

    return fallback;
}
