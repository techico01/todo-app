import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link href="/" className="text-white text-2xl font-bold hover:text-gray-200 transition duration-300">
                    TODO Calendar
                </Link>
                <div className="space-x-6">
                    <Link href="/todos" className="text-white hover:text-gray-200 transition duration-300">
                        TODOs
                    </Link>
                    <br></br>
                    <Link href="/events" className="text-white hover:text-gray-200 transition duration-300">
                        Events
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;