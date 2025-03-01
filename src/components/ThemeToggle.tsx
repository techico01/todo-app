import { useState } from 'react';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
        >
            {darkMode ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;