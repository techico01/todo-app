const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                    {todo.title}
                </span>
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
                Delete
            </button>
        </div>
    );
};

export default TodoItem;