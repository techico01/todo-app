import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DateTimePicker from '../components/DateTimePicker';

// Todo型の定義を追加
interface Todo {
    id: number;
    title: string;
    completed: boolean;
    deadline: string | null;
    createdAt: string;
}

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        setLoading(true);
        fetch('/api/todos')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch todos');
                }
                return res.json();
            })
            .then((data) => {
                console.log('Fetched todos:', data);
                setTodos(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching todos:', err);
                setError(err.message);
                setLoading(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        const newTodo = {
            title,
            completed: false,
            deadline: deadlineDate ? deadlineDate.toISOString() : null
        };

        // オプティミスティックUIアップデートのための仮ID
        const tempId = Date.now();

        // 即時に表示する仮のTodo
        const tempTodo = {
            id: tempId,
            title: newTodo.title,
            completed: false,
            deadline: newTodo.deadline,
            createdAt: new Date().toISOString()
        };

        // 即時に表示
        setTodos(prevTodos => [tempTodo, ...prevTodos]);

        // 入力欄をクリア
        setTitle('');
        setDeadlineDate(null);

        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to add todo');
                }
                return res.json();
            })
            .then((actualTodo) => {
                // 仮IDを実際のIDに置き換え
                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo.id === tempId ? actualTodo : todo
                    )
                );
            })
            .catch((err) => {
                console.error('Error adding todo:', err);
                setError(err.message);
                // エラー時は仮Todoを削除
                setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId));
            });
    };

    const toggleTodo = (id, completed) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed } : todo
            )
        );

        fetch(`/api/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to update todo');
                }
            })
            .catch((err) => {
                console.error('Error updating todo:', err);
                setError(err.message);
                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo.id === id ? { ...todo, completed: !completed } : todo
                    )
                );
            });
    };

    const deleteTodo = (id) => {
        const todoToDelete = todos.find(todo => todo.id === id);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

        fetch(`/api/todos/${id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to delete todo');
                }
            })
            .catch((err) => {
                console.error('Error deleting todo:', err);
                setError(err.message);
                if (todoToDelete) {
                    setTodos(prevTodos => [...prevTodos, todoToDelete]);
                }
            });
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 py-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Todo List</h1>

                {/* Todo 追加フォーム */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Add New Todo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="What needs to be done?"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="sm:w-64">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <DateTimePicker
                                        selectedDate={deadlineDate}
                                        onChange={(date) => setDeadlineDate(date)}
                                        placeholderText="期限を選択"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Add Todo
                            </button>
                        </div>
                    </form>
                </div>

                {/* エラー表示 */}
                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Todo リスト */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center dark:text-white">
                            <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p>Loading todos...</p>
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-lg">No todos yet. Add one above!</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {todos.map((todo) => (
                                <li
                                    key={todo.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                >
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={todo.completed}
                                                onChange={() => toggleTodo(todo.id, !todo.completed)}
                                                className="circle-checkbox"
                                            />
                                            <div>
                                                <span className={`font-medium ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                                    {todo.title}
                                                </span>
                                                {todo.deadline && (
                                                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {new Date(todo.deadline).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                                            aria-label="Delete todo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
}