import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import EventCalendar from '../components/EventCalendar';

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then((res) => res.json())
            .then((data) => setEvents(data));
    }, []);

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Event Calendar</h1>
                <EventCalendar events={events} />
            </div>
        </Layout>
    );
}