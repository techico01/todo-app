import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';

export default function Todos() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch('/api/todos')
            .then((res) => res.json())
            .then((data) => setTodos(data));
    }, []);

    const handleToggle = (id) => {
        // TODO: Toggle completion status
    };

    const handleDelete = (id) => {
        // TODO: Delete todo
    };

    const handleAdd = (title) => {
        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, completed: false }),
        })
            .then((res) => res.json())
            .then((newTodo) => {
                setTodos([...todos, newTodo]);
            });
    };

    return (
        <Layout>
            <div className="container mx-auto p-4 pb-20"> {/* pb-20でフォームの高さ分の余白を確保 */}
                <h1 className="text-3xl font-bold mb-4">TODO List</h1>
                <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
            </div>
            <AddTodoForm onAdd={handleAdd} />
        </Layout>
    );
}