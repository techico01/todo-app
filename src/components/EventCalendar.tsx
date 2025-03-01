import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events }) => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                className="rounded-lg overflow-hidden"
            />
        </div>
    );
};

export default EventCalendar;