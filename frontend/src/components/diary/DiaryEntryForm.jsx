import React, { useState } from "react";
import { useDiary } from "../../contexts/DiaryContext";
import { X, Save, Smile, Meh, Frown } from "lucide-react";

const DiaryEntryForm = ({ date, entry, onClose }) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [mood, setMood] = useState(entry?.mood || "");
  const [loading, setLoading] = useState(false);

  const { createEntry, updateEntry } = useDiary();

  const moods = [
    {
      value: "great",
      label: "Great",
      emoji: "😄",
      color: "from-green-400 to-emerald-500",
    },
    {
      value: "good",
      label: "Good",
      emoji: "🙂",
      color: "from-blue-400 to-cyan-500",
    },
    {
      value: "okay",
      label: "Okay",
      emoji: "😐",
      color: "from-yellow-400 to-amber-500",
    },
    {
      value: "bad",
      label: "Bad",
      emoji: "😟",
      color: "from-orange-400 to-red-500",
    },
    {
      value: "terrible",
      label: "Terrible",
      emoji: "😢",
      color: "from-red-500 to-pink-600",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setLoading(true);

    try {
      if (entry) {
        await updateEntry(date, entry._id, title, content, mood);
      } else {
        await createEntry(date, title, content, mood);
      }
      onClose();
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {entry ? "Edit Entry" : "New Entry"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Give your entry a title..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Thoughts *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Write what's on your mind..."
          />
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How are you feeling?
          </label>
          <div className="grid grid-cols-5 gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(mood === m.value ? "" : m.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  mood === m.value
                    ? `bg-gradient-to-br ${m.color} text-white border-transparent shadow-lg scale-105`
                    : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
                }`}
              >
                <div className="text-3xl mb-1">{m.emoji}</div>
                <div
                  className={`text-xs font-medium ${
                    mood === m.value ? "text-white" : "text-gray-600"
                  }`}
                >
                  {m.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : entry ? "Update Entry" : "Save Entry"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryEntryForm;
