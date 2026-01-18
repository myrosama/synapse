import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#0B1220',
                surface: '#101B2D',
                elevated: '#162035',
                border: 'rgba(255, 255, 255, 0.08)',
                primary: '#22D3EE',
                secondary: '#8B5CF6',
            },
            borderRadius: {
                xl: '12px',
                '2xl': '16px',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

export default config
