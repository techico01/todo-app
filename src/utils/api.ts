export const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    return res.json();
};

export const fetchEvents = async () => {
    const res = await fetch('/api/events');
    return res.json();
};