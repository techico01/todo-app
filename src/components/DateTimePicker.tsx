import React, { useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';

// 日本語ロケールを登録
registerLocale('ja', ja);

interface DateTimePickerProps {
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    selectedDate,
    onChange,
    placeholderText = '期限を選択'
}) => {
    return (
        <div className="custom-datepicker-container">
            <DatePicker
                selected={selectedDate}
                onChange={onChange}
                locale="ja"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy年MM月dd日 HH:mm"
                placeholderText={placeholderText}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                calendarClassName="custom-datepicker"
            />
        </div>
    );
};

export default DateTimePicker; 