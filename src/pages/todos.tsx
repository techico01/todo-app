import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';

// Todo の型を定義
type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

export default function Todos() {
    // useState の初期値に型を明示
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        fetch('/api/todos')
            .then((res) => res.json())
            .then((data: Todo[]) => setTodos(data)); // 型アノテーションを追加
    }, []);

    const handleToggle = (id: number) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDelete = (id: number) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    const handleAdd = (title: string) => {
        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, completed: false }),
        })
            .then((res) => res.json())
            .then((newTodo: Todo) => {
                setTodos((prevTodos) => [...prevTodos, newTodo]);
            });
    };

    return (
        <Layout>
            <div className="container mx-auto p-4 pb-20">
                <h1 className="text-3xl font-bold mb-4">TODO List</h1>
                <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
            </div>
            <AddTodoForm onAdd={handleAdd} />
        </Layout>
    );
}
