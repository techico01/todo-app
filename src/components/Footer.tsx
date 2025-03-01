import React from 'react';

export default function Footer() {
    return (
        <footer className="py-4 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Todo App</p>
        </footer>
    );
}