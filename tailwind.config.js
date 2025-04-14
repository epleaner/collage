/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontSize: {
                base: ['0.625rem', { lineHeight: '0.875rem' }], // 10px
                sm: ['0.5rem', { lineHeight: '0.75rem' }], // 8px
                xs: ['0.375rem', { lineHeight: '0.625rem' }], // 6px
            }
        },
    },
    plugins: [],
} 