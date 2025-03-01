import React from 'react';

export default function TodoList({ todos, onToggle, onDelete }) {
    if (!todos || todos.length === 0) {
        return <p className="mt-4">No todos yet. Add one above!</p>;
    }

    return (
        <div className="mt-6">
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex items-center justify-between p-4 border rounded bg-white shadow-sm"
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => onToggle(todo.id, !todo.completed)}
                                className="h-5 w-5 text-blue-600"
                            />
                            <span className={`ml-3 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                                {todo.title}
                            </span>
                            {todo.deadline && (
                                <span className="ml-3 text-sm text-gray-500">
                                    Due: {new Date(todo.deadline).toLocaleString()}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}