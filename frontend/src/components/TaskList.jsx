import React, { useState } from "react";
import { useTask } from "../contexts/TaskContext";
import TaskItem from "./TaskItem";
import { Loader2, Inbox } from "lucide-react";

const TaskList = ({ loading }) => {
  const { tasks } = useTask();
  const [filter, setFilter] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 px-6 py-4 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "all"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "pending"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "completed"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Task Items */}
      <div className="divide-y divide-gray-200">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Inbox className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No tasks found</p>
            <p className="text-sm">
              {filter === "all"
                ? "Create your first task to get started"
                : `No ${filter} tasks yet`}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => <TaskItem key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default TaskList;
