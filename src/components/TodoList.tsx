const TodoList = ({ todos, onToggle, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {todos.map((todo) => (
                <div
                    key={todo.id}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => onToggle(todo.id)}
                            className="form-checkbox h-6 w-6 text-blue-600 rounded-full border-2 border-gray-300 focus:ring-0"
                        />
                        <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                            {todo.title}
                        </span>
                    </div>
                    <button
                        onClick={() => onDelete(todo.id)}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TodoList;