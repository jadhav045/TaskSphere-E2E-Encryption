import React, { createContext, useState, useContext } from 'react';
import { diaryAPI } from '../services/api';
import encryptionService from '../utils/encryption';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const DiaryContext = createContext();

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

export const DiaryProvider = ({ children }) => {
  const [diaryEntries, setDiaryEntries] = useState({});
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchDiaryMonth = async (year, month) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const encryptedDiaries = await diaryAPI.getDiaryMonth(year, month);
      
      // Decrypt all entries
      const decryptedDiaries = await Promise.all(
        encryptedDiaries.map(async (diary) => {
          const decryptedEntries = await Promise.all(
            diary.entries.map(async (entry) => {
              try {
                const decryptedContent = await encryptionService.decryptData(
                  entry.content,
                  entry.iv
                );
                const decryptedTitle = entry.title
                  ? await encryptionService.decryptData(entry.title, entry.iv)
                  : '';

                return {
                  ...entry,
                  title: decryptedTitle.title || decryptedTitle || '',
                  content: decryptedContent.content || decryptedContent,
                };
              } catch (error) {
                console.error('Error decrypting entry:', error);
                return {
                  ...entry,
                  title: '[Decryption Error]',
                  content: '[Unable to decrypt]',
                };
              }
            })
          );

          return {
            ...diary,
            entries: decryptedEntries,
          };
        })
      );

      // Store by date
      const entriesByDate = {};
      decryptedDiaries.forEach((diary) => {
        const dateKey = new Date(diary.date).toISOString().split('T')[0];
        entriesByDate[dateKey] = diary;
      });

      setDiaryEntries(entriesByDate);
    } catch (error) {
      console.error('Error fetching diary month:', error);
      toast.error('Failed to fetch diary entries');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiaryByDate = async (date) => {
    setLoading(true);
    try {
      const encryptedDiary = await diaryAPI.getDiaryByDate(date);
      
      if (!encryptedDiary.entries || encryptedDiary.entries.length === 0) {
        return { date, entries: [] };
      }

      const decryptedEntries = await Promise.all(
        encryptedDiary.entries.map(async (entry) => {
          try {
            const decryptedContent = await encryptionService.decryptData(
              entry.content,
              entry.iv
            );
            const decryptedTitle = entry.title
              ? await encryptionService.decryptData(entry.title, entry.iv)
              : '';

            return {
              ...entry,
              title: decryptedTitle.title || decryptedTitle || '',
              content: decryptedContent.content || decryptedContent,
            };
          } catch (error) {
            console.error('Error decrypting entry:', error);
            return {
              ...entry,
              title: '[Decryption Error]',
              content: '[Unable to decrypt]',
            };
          }
        })
      );

      const diary = {
        ...encryptedDiary,
        entries: decryptedEntries,
      };

      const dateKey = new Date(date).toISOString().split('T')[0];
      setDiaryEntries((prev) => ({ ...prev, [dateKey]: diary }));

      return diary;
    } catch (error) {
      console.error('Error fetching diary:', error);
      toast.error('Failed to fetch diary');
      return { date, entries: [] };
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (date, title, content, mood) => {
    try {
      // Encrypt title and content
      const encryptedContent = await encryptionService.encryptData({ content });
      const encryptedTitle = title
        ? await encryptionService.encryptData({ title })
        : { encrypted: '', iv: encryptedContent.iv };

      const newEntry = await diaryAPI.createEntry({
        date,
        title: encryptedTitle.encrypted,
        content: encryptedContent.encrypted,
        iv: encryptedContent.iv,
        mood: mood || '',
      });

      // Update local state with decrypted version
      const dateKey = new Date(date).toISOString().split('T')[0];
      const decryptedEntries = await Promise.all(
        newEntry.entries.map(async (entry) => {
          if (entry.content === encryptedContent.encrypted) {
            return {
              ...entry,
              title: title || '',
              content,
            };
          }
          // Decrypt other entries
          try {
            const decContent = await encryptionService.decryptData(entry.content, entry.iv);
            const decTitle = entry.title
              ? await encryptionService.decryptData(entry.title, entry.iv)
              : '';
            return {
              ...entry,
              title: decTitle.title || decTitle || '',
              content: decContent.content || decContent,
            };
          } catch (error) {
            return entry;
          }
        })
      );

      setDiaryEntries((prev) => ({
        ...prev,
        [dateKey]: { ...newEntry, entries: decryptedEntries },
      }));

      toast.success('Diary entry created!');
      return newEntry;
    } catch (error) {
      console.error('Error creating entry:', error);
      toast.error('Failed to create entry');
      throw error;
    }
  };

  const updateEntry = async (date, entryId, title, content, mood) => {
    try {
      const encryptedContent = await encryptionService.encryptData({ content });
      const encryptedTitle = title
        ? await encryptionService.encryptData({ title })
        : { encrypted: '', iv: encryptedContent.iv };

      await diaryAPI.updateEntry(date, entryId, {
        title: encryptedTitle.encrypted,
        content: encryptedContent.encrypted,
        iv: encryptedContent.iv,
        mood: mood || '',
      });

      // Update local state
      const dateKey = new Date(date).toISOString().split('T')[0];
      setDiaryEntries((prev) => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          entries: prev[dateKey].entries.map((entry) =>
            entry._id === entryId
              ? { ...entry, title, content, mood }
              : entry
          ),
        },
      }));

      toast.success('Entry updated!');
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Failed to update entry');
      throw error;
    }
  };

  const deleteEntry = async (date, entryId) => {
    try {
      await diaryAPI.deleteEntry(date, entryId);

      const dateKey = new Date(date).toISOString().split('T')[0];
      setDiaryEntries((prev) => {
        const updatedDiary = { ...prev[dateKey] };
        updatedDiary.entries = updatedDiary.entries.filter(
          (entry) => entry._id !== entryId
        );

        if (updatedDiary.entries.length === 0) {
          const { [dateKey]: removed, ...rest } = prev;
          return rest;
        }

        return { ...prev, [dateKey]: updatedDiary };
      });

      toast.success('Entry deleted!');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
      throw error;
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await diaryAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const value = {
    diaryEntries,
    loading,
    stats,
    fetchDiaryMonth,
    fetchDiaryByDate,
    createEntry,
    updateEntry,
    deleteEntry,
    fetchStats,
  };

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
};