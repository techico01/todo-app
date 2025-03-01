import { motion } from 'framer-motion';

const AnimatedTodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
        >
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
        </motion.div>
    );
};

export default AnimatedTodoItem;