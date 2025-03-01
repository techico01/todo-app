import React from 'react';
import Head from 'next/head';
import Footer from './Footer';
import DarkModeToggle from './DarkModeToggle';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
            <Head>
                <title>Todo App</title>
                <meta name="description" content="A simple todo application" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="color-scheme" content="light dark" />
            </Head>

            <div className="container mx-auto px-4 py-4 flex justify-end">
                <DarkModeToggle />
            </div>

            <main className="flex-grow">
                {children}
            </main>

            <Footer />
        </div>
    );
}