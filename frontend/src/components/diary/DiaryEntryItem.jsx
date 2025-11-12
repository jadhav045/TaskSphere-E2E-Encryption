import React from 'react';
import { useDiary } from '../../contexts/DiaryContext';
import { Edit2, Trash2, Clock } from 'lucide-react';

const DiaryEntryItem = ({ entry, date, index, onEdit }) => {
  const { deleteEntry } = useDiary();

  const moodEmojis = {
    great: '😄',
    good: '🙂',
    okay: '😐',
    bad: '😟',
    terrible: '😢',
  };

  const moodColors = {
    great: 'from-green-400 to-emerald-500',
    good: 'from-blue-400 to-cyan-500',
    okay: 'from-yellow-400 to-amber-500',
    bad: 'from-orange-400 to-red-500',
    terrible: 'from-red-500 to-pink-600',
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(date, entry._id);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {entry.mood && (
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                  moodColors[entry.mood]
                } flex items-center justify-center text-xl shadow-md`}
              >
                {moodEmojis[entry.mood]}
              </div>
            )}
            
            {entry.title && (
              <h3 className="text-xl font-bold text-gray-800">{entry.title}</h3>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatTime(entry.createdAt)}</span>
            {entry.updatedAt !== entry.createdAt && (
              <span className="text-gray-400">• Edited</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
            title="Edit entry"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {entry.content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Entry #{index + 1}</span>
          <span>Encrypted & Secure 🔒</span>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntryItem;