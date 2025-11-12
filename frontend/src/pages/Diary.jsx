import React, { useState, useEffect } from "react";
import { useDiary } from "../contexts/DiaryContext";
import Calendar from "../components/diary/Calendar";
import DiaryEntries from "../components/diary/DiaryEntries";
import DiaryStats from "../components/diary/DiaryStats";
import { Book, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Diary = () => {
  const navigate = useNavigate();
  const { fetchDiaryMonth, fetchStats, stats } = useDiary();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    fetchDiaryMonth(year, month);
    fetchStats();
  }, [currentMonth]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleBackToCalendar = () => {
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Diary
                </h1>
                <p className="text-sm text-gray-500">
                  Your private, encrypted journal
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        {!selectedDate && stats && <DiaryStats stats={stats} />}

        {/* Main Content */}
        <div className="mt-8">
          {selectedDate ? (
            <DiaryEntries
              selectedDate={selectedDate}
              onBack={handleBackToCalendar}
            />
          ) : (
            <Calendar
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              onDateSelect={handleDateSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Diary;
