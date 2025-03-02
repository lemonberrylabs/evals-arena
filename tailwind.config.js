/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                border: 'rgb(var(--border) / <alpha-value>)',
                input: 'rgb(var(--input) / <alpha-value>)',
                ring: 'rgb(var(--ring) / <alpha-value>)',
                background: 'rgb(var(--background) / <alpha-value>)',
                foreground: 'rgb(var(--foreground) / <alpha-value>)',
                primary: {
                    DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
                    foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
                    foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
                },
                destructive: {
                    DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
                    foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
                },
                muted: {
                    DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
                    foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
                    foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
                },
                popover: {
                    DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
                    foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
                },
                card: {
                    DEFAULT: 'rgb(var(--card) / <alpha-value>)',
                    foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                red: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
                amber: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                green: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                blue: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                purple: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
    safelist: [
        // Spacing
        'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8',
        'py-1', 'py-2', 'py-3', 'py-4', 'py-6', 'py-8',
        'p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'p-8',
        'mr-1', 'ml-1', 'mt-1', 'mb-1', 'mt-2', 'mb-2', 'mt-4', 'mb-4',
        'gap-1', 'gap-2', 'gap-4',
        'space-x-1', 'space-x-2', 'space-y-4', 'space-y-6',

        // Typography
        'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
        'font-medium', 'font-semibold', 'font-bold',
        'text-white', 'text-black',
        'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800',
        'text-red-500', 'text-red-600', 'text-red-700',
        'text-amber-500', 'text-amber-600', 'text-amber-700', 'text-amber-800', 'text-amber-900',
        'text-green-500', 'text-green-800',
        'text-purple-500', 'text-purple-800',
        'text-blue-500', 'text-blue-800',

        // Sizing
        'h-3', 'h-4', 'h-5', 'h-6', 'h-8', 'h-10', 'h-12', 'h-24', 'h-64',
        'w-3', 'w-4', 'w-5', 'w-6', 'w-8', 'w-10', 'w-12', 'w-24', 'w-full',
        'max-h-24', 'max-h-64',
        'max-w-none', 'max-w-2xl', 'max-w-4xl',

        // Layout
        'flex', 'inline-flex', 'items-center', 'items-start', 'justify-between', 'justify-center',
        'flex-col', 'flex-row', 'flex-wrap',
        'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3',
        'absolute', 'relative', 'inset-x-0', 'inset-y-0', 'top-0',

        // Borders
        'border', 'border-t', 'border-b', 'border-l', 'border-r',
        'border-gray-100', 'border-gray-200', 'border-gray-300', 'border-gray-400',
        'border-red-200', 'border-red-500',
        'border-amber-200', 'border-amber-500',
        'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',

        // Backgrounds
        'bg-white', 'bg-black', 'bg-transparent',
        'bg-gray-50', 'bg-gray-100', 'bg-gray-200',
        'bg-red-50', 'bg-red-100', 'bg-red-500', 'bg-red-600',
        'bg-amber-50', 'bg-amber-100', 'bg-amber-400', 'bg-amber-500',
        'bg-green-100',
        'bg-blue-100',
        'bg-purple-100',
        'bg-gradient-to-r', 'from-amber-50', 'to-red-50', 'from-amber-500', 'to-red-600',

        // Effects
        'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg',
        'hover:shadow-md', 'hover:bg-gray-50', 'hover:bg-red-700',

        // Other
        'transition-all', 'overflow-y-hidden', 'overflow-x-auto',
        'whitespace-pre-wrap', 'whitespace-nowrap',
        'line-clamp-2',
    ]
}