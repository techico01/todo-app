import React, { useState } from 'react';

// 配列の型を明示的に定義
type CalendarDay = {
    day: number;
    currentMonth: boolean;
    prevMonth?: boolean;
    nextMonth?: boolean;
};

const AddTodoForm = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // 日付と時間を分離して管理
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('00:00');

    // 現在の年月を取得
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const [displayMonth, setDisplayMonth] = useState(currentMonth);
    const [displayYear, setDisplayYear] = useState(currentYear);

    // 月の日数を取得
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // 月の最初の日の曜日を取得（0: 日曜日, 1: 月曜日, ...）
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // 前月へ
    const prevMonth = () => {
        if (displayMonth === 0) {
            setDisplayMonth(11);
            setDisplayYear(displayYear - 1);
        } else {
            setDisplayMonth(displayMonth - 1);
        }
    };

    // 次月へ
    const nextMonth = () => {
        if (displayMonth === 11) {
            setDisplayMonth(0);
            setDisplayYear(displayYear + 1);
        } else {
            setDisplayMonth(displayMonth + 1);
        }
    };

    // 日付をフォーマット (YYYY-MM-DD)
    const formatDateForInput = (year, month, day) => {
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    // 日付を選択
    const selectDate = (day) => {
        const date = formatDateForInput(displayYear, displayMonth, day);
        console.log('Selected date:', date);
        setSelectedDate(date);
    };

    // カレンダー行を生成
    const generateCalendarDays = (): CalendarDay[][] => {
        const daysInMonth = getDaysInMonth(displayYear, displayMonth);
        const firstDay = getFirstDayOfMonth(displayYear, displayMonth);

        // 前月の日数
        const prevMonthDays = displayMonth === 0
            ? getDaysInMonth(displayYear - 1, 11)
            : getDaysInMonth(displayYear, displayMonth - 1);

        const days: CalendarDay[][] = [];
        let dayCount = 1;
        let nextMonthDay = 1;

        // 週ごとに行を生成
        for (let i = 0; i < 6; i++) {
            const week: CalendarDay[] = [];

            // 各日を追加
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    // 前月の日
                    const prevDay = prevMonthDays - (firstDay - j - 1);
                    week.push({ day: prevDay, currentMonth: false, prevMonth: true });
                } else if (dayCount <= daysInMonth) {
                    // 当月の日
                    week.push({ day: dayCount, currentMonth: true });
                    dayCount++;
                } else {
                    // 次月の日
                    week.push({ day: nextMonthDay, currentMonth: false, nextMonth: true });
                    nextMonthDay++;
                }
            }

            days.push(week);

            // 次月の日が表示され始めたら、最後の週を表示しない
            if (dayCount > daysInMonth && i >= 3) break;
        }

        return days;
    };

    // 月の名前
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            console.log('Form submission - Title:', title);
            console.log('Selected date before conversion:', selectedDate);
            console.log('Selected time before conversion:', selectedTime);

            // 日付と時間を組み合わせて期限を設定
            if (selectedDate && selectedTime) {
                try {
                    // 日付文字列を分解
                    const [year, month, day] = selectedDate.split('-').map(Number);
                    const [hours, minutes] = selectedTime.split(':').map(Number);

                    console.log('Parsed date components:', { year, month, day, hours, minutes });

                    // 日付オブジェクトの作成
                    const deadline = new Date(year, month - 1, day, hours, minutes);
                    console.log('Created deadline object:', deadline);
                    console.log('Deadline timestamp:', deadline.getTime());
                    console.log('Deadline ISO string:', deadline.toISOString());

                    // タスクの追加
                    onAdd(title.trim(), deadline);
                } catch (err) {
                    console.error('Error creating deadline:', err);
                    alert('日付の設定に問題がありました。もう一度お試しください。');
                }
            } else {
                // 期限なしでタスクを追加
                console.log('Adding task without deadline');
                onAdd(title.trim(), null);
            }

            // フォームのリセット
            setTitle('');
            setSelectedDate('');
            setSelectedTime('00:00');
            setIsExpanded(false);
            setShowDatePicker(false);
        }
    };

    // 期限を保存
    const saveDateTime = () => {
        console.log('Saving date and time:', selectedDate, selectedTime);
        setShowDatePicker(false);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 border-t border-gray-200 dark:border-gray-700 z-20">
            <form onSubmit={handleSubmit} className="container mx-auto max-w-4xl">
                {isExpanded ? (
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What needs to be done?"
                                className="flex-grow p-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring focus:ring-blue-500 outline-none"
                                autoFocus
                            />
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className="p-3 pl-10 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center min-w-[180px]"
                                >
                                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {selectedDate ?
                                        `${selectedDate.replace(/-/g, '/')} ${selectedTime}` :
                                        '期限を設定'}
                                </button>

                                {showDatePicker && (
                                    <div className="absolute right-0 top-[-380px] z-30">
                                        <div className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-lg w-[300px]">
                                            {/* カレンダーヘッダー */}
                                            <div className="flex justify-between items-center p-2 border-b border-gray-700">
                                                <span>{displayYear}年{monthNames[displayMonth]}</span>
                                                <div className="flex">
                                                    <button type="button" onClick={prevMonth} className="p-1">▲</button>
                                                    <button type="button" onClick={nextMonth} className="p-1">▼</button>
                                                </div>
                                            </div>

                                            {/* 曜日ヘッダー */}
                                            <div className="grid grid-cols-7 text-center py-2">
                                                {dayNames.map((day, index) => (
                                                    <div key={index} className="text-sm">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* カレンダー本体 */}
                                            <div className="p-2">
                                                {generateCalendarDays().map((week, weekIndex) => (
                                                    <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                                                        {week.map((dateObj, dayIndex) => {
                                                            const dateString = formatDateForInput(
                                                                displayYear + (dateObj.nextMonth ? 1 : (dateObj.prevMonth ? -1 : 0)),
                                                                dateObj.prevMonth ?
                                                                    (displayMonth === 0 ? 11 : displayMonth - 1) :
                                                                    (dateObj.nextMonth ?
                                                                        (displayMonth === 11 ? 0 : displayMonth + 1) :
                                                                        displayMonth),
                                                                dateObj.day
                                                            );

                                                            const isSelected = selectedDate === dateString;

                                                            return (
                                                                <button
                                                                    key={dayIndex}
                                                                    type="button"
                                                                    onClick={() => selectDate(dateObj.day)}
                                                                    className={`
                                                                        text-center py-1 rounded-full
                                                                        ${dateObj.currentMonth ? 'text-white' : 'text-gray-500'}
                                                                        ${isSelected ? 'bg-blue-600' : 'hover:bg-gray-700'}
                                                                    `}
                                                                >
                                                                    {dateObj.day}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 時間選択 */}
                                            <div className="flex justify-center p-2 border-t border-gray-700">
                                                <input
                                                    type="time"
                                                    value={selectedTime}
                                                    onChange={(e) => setSelectedTime(e.target.value)}
                                                    className="bg-gray-800 text-white border border-gray-700 rounded p-1"
                                                />
                                            </div>

                                            {/* ボタン */}
                                            <div className="flex justify-between p-2 border-t border-gray-700">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDatePicker(false)}
                                                    className="px-4 py-1 bg-gray-700 text-white rounded"
                                                >
                                                    キャンセル
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={saveDateTime}
                                                    className="px-4 py-1 bg-indigo-600 text-white rounded"
                                                >
                                                    保存
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsExpanded(false);
                                    setShowDatePicker(false);
                                }}
                                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                タスク追加
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="w-full p-3 flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        新しいタスクを追加...
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddTodoForm;