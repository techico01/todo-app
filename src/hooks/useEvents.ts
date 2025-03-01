import { useEffect, useState } from 'react';

const useEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then((res) => res.json())
            .then((data) => setEvents(data));
    }, []);

    return { events };
};

export default useEvents;