import { useEffect, useState } from 'react';

const useTodos = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch('/api/todos')
            .then((res) => res.json())
            .then((data) => setTodos(data));
    }, []);

    return { todos };
};

export default useTodos;