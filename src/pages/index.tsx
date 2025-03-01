import Layout from '../components/Layout';

export default function Home() {
    return (
        <Layout>
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to TODO Calendar</h1>
                <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
                    Manage your tasks and events efficiently with our intuitive TODO Calendar app. Stay organized and never miss a deadline!
                </p>
            </div>
        </Layout>
    );
}