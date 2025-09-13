import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks
                    react: ['react', 'react-dom'],
                    inertia: ['@inertiajs/react'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
                    
                    // Feature chunks
                    admin: [
                        'resources/js/pages/admin/dashboard.tsx',
                        'resources/js/pages/admin/users/index.tsx',
                        'resources/js/pages/admin/companies/index.tsx',
                    ],
                    auth: [
                        'resources/js/pages/auth/login.tsx',
                        'resources/js/pages/auth/register.tsx',
                    ],
                    jobs: [
                        'resources/js/pages/jobs/index.tsx',
                        'resources/js/pages/jobs/show.tsx',
                        'resources/js/pages/jobs/apply.tsx',
                    ],
                }
            }
        },
        chunkSizeWarningLimit: 600,
    },
});
