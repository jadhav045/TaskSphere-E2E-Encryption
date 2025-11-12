import React, { useState, useEffect } from "react";
import { useDiary } from "../../contexts/DiaryContext";
import DiaryEntryForm from "./DiaryEntryForm";
import DiaryEntryItem from "./DiaryEntryItem";
import { ArrowLeft, Plus, Calendar, Loader2 } from "lucide-react";

const DiaryEntries = ({ selectedDate, onBack }) => {
  const { diaryEntries, fetchDiaryByDate, loading } = useDiary();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const dateKey = selectedDate.toISOString().split("T")[0];
  const diary = diaryEntries[dateKey];

  useEffect(() => {
    fetchDiaryByDate(dateKey);
  }, [dateKey]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Calendar</span>
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">New Entry</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {formatDate(selectedDate)}
          </h2>
        </div>
      </div>

      {/* Entry Form */}
      {showForm && (
        <div className="mb-6">
          <DiaryEntryForm
            date={dateKey}
            entry={editingEntry}
            onClose={handleCloseForm}
          />
        </div>
      )}

      {/* Entries List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading entries...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {!diary || diary.entries.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No entries yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start writing your thoughts for this day
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create First Entry
              </button>
            </div>
          ) : (
            diary.entries.map((entry, index) => (
              <DiaryEntryItem
                key={entry._id}
                entry={entry}
                date={dateKey}
                index={index}
                onEdit={() => handleEdit(entry)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DiaryEntries;
