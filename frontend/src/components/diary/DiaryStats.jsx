import React from "react";
import { Calendar, BookOpen, Flame } from "lucide-react";

const DiaryStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Days */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm mb-1">Total Days</p>
            <p className="text-4xl font-bold">{stats.totalDays}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-400/30">
          <p className="text-purple-100 text-sm">Days with entries</p>
        </div>
      </div>

      {/* Total Entries */}
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-pink-100 text-sm mb-1">Total Entries</p>
            <p className="text-4xl font-bold">{stats.totalEntries}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-pink-400/30">
          <p className="text-pink-100 text-sm">Thoughts recorded</p>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm mb-1">Current Streak</p>
            <p className="text-4xl font-bold">{stats.currentStreak}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Flame className="w-7 h-7" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-orange-400/30">
          <p className="text-orange-100 text-sm">
            {stats.currentStreak === 0
              ? "Start writing today!"
              : stats.currentStreak === 1
              ? "Keep going! 🎉"
              : "Amazing consistency! 🔥"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiaryStats;
