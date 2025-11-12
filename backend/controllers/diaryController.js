const Diary = require('../models/Diary');

// Helper function to normalize date to start of day
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

// @desc    Get all diary entries for a month
// @route   GET /api/diary/month/:year/:month
// @access  Private
const getDiaryMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const startDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
    const endDate = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59));

    const diaries = await Diary.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    res.json(diaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get diary entries for a specific date
// @route   GET /api/diary/:date
// @access  Private
const getDiaryByDate = async (req, res) => {
  try {
    const date = normalizeDate(req.params.date);

    const diary = await Diary.findOne({
      user: req.user._id,
      date: date
    });

    if (!diary) {
      return res.json({ date, entries: [] });
    }

    res.json(diary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update diary entry for a date
// @route   POST /api/diary
// @access  Private
const createDiaryEntry = async (req, res) => {
  try {
    const { date, title, content, iv, mood } = req.body;

    if (!date || !content || !iv) {
      return res.status(400).json({ message: 'Please provide date, content, and iv' });
    }

    const normalizedDate = normalizeDate(date);

    // Find or create diary document for this date
    let diary = await Diary.findOne({
      user: req.user._id,
      date: normalizedDate
    });

    const newEntry = {
      title: title || '',
      content,
      iv,
      mood: mood || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (diary) {
      // Add entry to existing diary
      diary.entries.push(newEntry);
      diary.updatedAt = new Date();
      await diary.save();
    } else {
      // Create new diary document
      diary = await Diary.create({
        user: req.user._id,
        date: normalizedDate,
        entries: [newEntry]
      });
    }

    res.status(201).json(diary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a specific diary entry
// @route   PUT /api/diary/:date/:entryId
// @access  Private
const updateDiaryEntry = async (req, res) => {
  try {
    const { date, entryId } = req.params;
    const { title, content, iv, mood } = req.body;

    const normalizedDate = normalizeDate(date);

    const diary = await Diary.findOne({
      user: req.user._id,
      date: normalizedDate
    });

    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    const entry = diary.entries.id(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Update entry fields
    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (iv !== undefined) entry.iv = iv;
    if (mood !== undefined) entry.mood = mood;
    entry.updatedAt = new Date();

    diary.updatedAt = new Date();
    await diary.save();

    res.json(diary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a specific diary entry
// @route   DELETE /api/diary/:date/:entryId
// @access  Private
const deleteDiaryEntry = async (req, res) => {
  try {
    const { date, entryId } = req.params;
    const normalizedDate = normalizeDate(date);

    const diary = await Diary.findOne({
      user: req.user._id,
      date: normalizedDate
    });

    if (!diary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    // Remove the entry
    diary.entries = diary.entries.filter(
      entry => entry._id.toString() !== entryId
    );

    // If no entries left, delete the diary document
    if (diary.entries.length === 0) {
      await diary.deleteOne();
      return res.json({ message: 'Diary entry deleted', date: normalizedDate });
    }

    diary.updatedAt = new Date();
    await diary.save();

    res.json({ message: 'Entry deleted', diary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get diary statistics
// @route   GET /api/diary/stats
// @access  Private
const getDiaryStats = async (req, res) => {
  try {
    const totalDays = await Diary.countDocuments({ user: req.user._id });
    
    const allDiaries = await Diary.find({ user: req.user._id });
    const totalEntries = allDiaries.reduce((sum, diary) => sum + diary.entries.length, 0);

    // Calculate current streak
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);

    while (true) {
      const diary = await Diary.findOne({
        user: req.user._id,
        date: checkDate
      });

      if (diary && diary.entries.length > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({
      totalDays,
      totalEntries,
      currentStreak: streak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDiaryMonth,
  getDiaryByDate,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  getDiaryStats
};