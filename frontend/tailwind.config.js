// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        // By keeping 'extend' empty, we tell Tailwind to use its entire default theme,
        // which includes the full color palette (cyan, purple, green, etc.).
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                sans: ['Poppins', 'sans-serif'], // Override default sans-serif with Poppins
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
