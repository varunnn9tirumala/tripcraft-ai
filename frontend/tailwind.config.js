import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                },
                orange: {
                    50: 'oklch(var(--orange-50))',
                    100: 'oklch(var(--orange-100))',
                    200: 'oklch(0.92 0.08 40)',
                    300: 'oklch(0.85 0.12 38)',
                    400: 'oklch(0.75 0.15 36)',
                    500: 'oklch(0.65 0.18 35)',
                    600: 'oklch(0.58 0.15 35)',
                    700: 'oklch(0.48 0.12 35)',
                    800: 'oklch(0.35 0.08 35)',
                    900: 'oklch(0.25 0.05 35)',
                    950: 'oklch(0.15 0.03 35)'
                },
                coral: {
                    50: 'oklch(var(--coral-50))',
                    100: 'oklch(var(--coral-100))',
                    200: 'oklch(0.88 0.10 42)',
                    300: 'oklch(0.80 0.14 40)',
                    400: 'oklch(0.70 0.16 38)',
                    500: 'oklch(0.62 0.18 36)',
                    600: 'oklch(0.55 0.16 35)',
                    700: 'oklch(0.45 0.12 34)',
                    800: 'oklch(0.32 0.08 33)',
                    900: 'oklch(0.22 0.05 32)',
                    950: 'oklch(0.12 0.03 31)'
                },
                amber: {
                    50: 'oklch(0.97 0.03 70)',
                    100: 'oklch(0.94 0.06 65)',
                    200: 'oklch(0.90 0.10 60)',
                    300: 'oklch(0.82 0.14 55)',
                    400: 'oklch(0.74 0.16 50)',
                    500: 'oklch(0.66 0.18 48)',
                    600: 'oklch(0.58 0.16 46)',
                    700: 'oklch(0.48 0.12 44)',
                    800: 'oklch(0.35 0.08 42)',
                    900: 'oklch(0.25 0.05 40)',
                    950: 'oklch(0.15 0.03 38)'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
