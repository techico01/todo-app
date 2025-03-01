module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                meiryo: ['"Meiryo UI"', '"Meiryo"', 'sans-serif'],
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};