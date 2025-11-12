import React from "react";
import { useDiary } from "../../contexts/DiaryContext";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";

const Calendar = ({ currentMonth, onMonthChange, onDateSelect }) => {
  const { diaryEntries } = useDiary();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    onMonthChange(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    onMonthChange(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateClick = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onDateSelect(date);
  };

  const hasEntriesForDate = (day) => {
    const dateKey = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];

    return diaryEntries[dateKey] && diaryEntries[dateKey].entries.length > 0;
  };

  const getMoodForDate = (day) => {
    const dateKey = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];

    const diary = diaryEntries[dateKey];
    if (!diary || diary.entries.length === 0) return null;

    // Get the most recent mood
    return diary.entries[diary.entries.length - 1].mood;
  };

  const moodColors = {
    great: "bg-green-400",
    good: "bg-blue-400",
    okay: "bg-yellow-400",
    bad: "bg-orange-400",
    terrible: "bg-red-400",
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  // Create calendar grid
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`aspect-square rounded-xl p-2 transition-all duration-200 hover:scale-105 relative group ${
          isToday(day)
            ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
            : hasEntriesForDate(day)
            ? "bg-white text-gray-800 shadow-md hover:shadow-lg border-2 border-purple-200"
            : "bg-white/50 text-gray-600 hover:bg-white hover:shadow-md"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span
            className={`text-lg font-semibold ${
              isToday(day) ? "text-white" : ""
            }`}
          >
            {day}
          </span>
          {hasEntriesForDate(day) && (
            <div className="flex gap-1 mt-1">
              <Circle
                className={`w-2 h-2 ${
                  getMoodForDate(day)
                    ? moodColors[getMoodForDate(day)]
                    : "bg-purple-400"
                } rounded-full`}
                fill="currentColor"
              />
            </div>
          )}
        </div>

        {/* Tooltip */}
        {hasEntriesForDate(day) && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Click to view entries
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-purple-100 rounded-lg transition"
        >
          <ChevronLeft className="w-6 h-6 text-purple-600" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-purple-100 rounded-lg transition"
        >
          <ChevronRight className="w-6 h-6 text-purple-600" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">{calendarDays}</div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-purple-200 rounded"></div>
            <span className="text-gray-600">Has entries</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle
              className="w-3 h-3 bg-green-400 rounded-full"
              fill="currentColor"
            />
            <span className="text-gray-600">Great mood</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
