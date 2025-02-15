/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
    darkMode: ["class"],
    content: ["src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                "uniSansCAPS": ["Uni Sans CAPS", ...defaultTheme.fontFamily.sans],
                "montserrat": ["Montserrat", "Noto Sans JP", ...defaultTheme.fontFamily.sans],
                "notoSans": ["Noto Sans", ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                "heartPulse": {
                    '0%, 25%, 60%': { transform: 'scale(1)' },
                    '5%, 35%': { transform: 'scale(1.25)' },
                }
            },
            animation: {
                'heart-pulse': 'heartPulse 0.9375s linear infinite',
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
}