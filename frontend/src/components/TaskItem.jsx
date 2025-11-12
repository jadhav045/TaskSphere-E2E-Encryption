import React, { useState } from "react";
import { useTask } from "../contexts/TaskContext";
import TaskForm from "./TaskForm";
import {
  Trash2,
  Edit2,
  Calendar,
  Tag,
  CheckCircle2,
  Circle,
} from "lucide-react";

const TaskItem = ({ task }) => {
  const { toggleComplete, deleteTask } = useTask();
  const [isEditing, setIsEditing] = useState(false);

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isEditing) {
    return <TaskForm task={task} onClose={() => setIsEditing(false)} />;
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(task._id)}
          className="mt-1 flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600 transition" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3
              className={`text-lg font-semibold ${
                task.completed ? "text-gray-400 line-through" : "text-gray-800"
              }`}
            >
              {task.title}
            </h3>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`text-sm mb-3 ${
                task.completed ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Badge */}
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className="mt-3 text-xs text-gray-400">
            Created: {formatDate(task.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
