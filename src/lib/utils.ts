import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getAssetPath(path: string) {
    const isProd = process.env.NODE_ENV === 'production';
    const basePath = isProd ? '/gluco-track' : '';
    return `${basePath}${path.startsWith('/') ? '' : '/'}${path}`;
}
