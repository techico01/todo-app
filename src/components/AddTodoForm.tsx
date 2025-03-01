import { useState } from 'react';

const AddTodoForm = ({ onAdd }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title);
            setTitle('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
            <div className="container mx-auto flex space-x-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new TODO"
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Add
                </button>
            </div>
        </form>
    );
};

export default AddTodoForm;