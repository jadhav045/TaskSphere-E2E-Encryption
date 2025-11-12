import React, { createContext, useState, useContext, useEffect } from 'react';
import { taskAPI } from '../services/api';
import encryptionService from '../utils/encryption';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch tasks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const encryptedTasks = await taskAPI.getTasks();
      
      // Decrypt tasks
      const decryptedTasks = await Promise.all(
        encryptedTasks.map(async (task) => {
          try {
            const decryptedTitle = await encryptionService.decryptData(
              task.title,
              task.iv
            );
            const decryptedDescription = task.description
              ? await encryptionService.decryptData(task.description, task.iv)
              : '';

            return {
              ...task,
              title: decryptedTitle.title || decryptedTitle,
              description: decryptedDescription.description || decryptedDescription,
            };
          } catch (error) {
            console.error('Error decrypting task:', error);
            return {
              ...task,
              title: '[Decryption Error]',
              description: '[Unable to decrypt]',
            };
          }
        })
      );

      setTasks(decryptedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      // Encrypt title and description
      const encryptedTitle = await encryptionService.encryptData({
        title: taskData.title,
      });
      const encryptedDescription = taskData.description
        ? await encryptionService.encryptData({ description: taskData.description })
        : { encrypted: '', iv: encryptedTitle.iv };

      // Create task with encrypted data
      const newTask = await taskAPI.createTask({
        title: encryptedTitle.encrypted,
        description: encryptedDescription.encrypted,
        iv: encryptedTitle.iv,
        completed: taskData.completed || false,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        tags: taskData.tags || [],
      });

      // Decrypt for local state
      const decryptedTask = {
        ...newTask,
        title: taskData.title,
        description: taskData.description || '',
      };

      setTasks([decryptedTask, ...tasks]);
      toast.success('Task created successfully!');
      return decryptedTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      let updatePayload = { ...taskData };

      // Encrypt if title or description changed
      if (taskData.title !== undefined || taskData.description !== undefined) {
        const dataToEncrypt = {};
        if (taskData.title !== undefined) dataToEncrypt.title = taskData.title;
        if (taskData.description !== undefined)
          dataToEncrypt.description = taskData.description;

        const encrypted = await encryptionService.encryptData(dataToEncrypt);
        updatePayload = {
          ...updatePayload,
          title: taskData.title !== undefined ? encrypted.encrypted : undefined,
          description:
            taskData.description !== undefined ? encrypted.encrypted : undefined,
          iv: encrypted.iv,
        };
      }

      const updatedTask = await taskAPI.updateTask(id, updatePayload);

      // Update local state with decrypted data
      setTasks(
        tasks.map((task) =>
          task._id === id
            ? {
                ...updatedTask,
                title: taskData.title !== undefined ? taskData.title : task.title,
                description:
                  taskData.description !== undefined
                    ? taskData.description
                    : task.description,
              }
            : task
        )
      );

      toast.success('Task updated successfully!');
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  const value = {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};