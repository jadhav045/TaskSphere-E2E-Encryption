const express = require('express');
const router = express.Router();
const {
  getDiaryMonth,
  getDiaryByDate,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  getDiaryStats
} = require('../controllers/diaryController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/stats', protect, getDiaryStats);
router.get('/month/:year/:month', protect, getDiaryMonth);
router.get('/:date', protect, getDiaryByDate);
router.post('/', protect, createDiaryEntry);
router.put('/:date/:entryId', protect, updateDiaryEntry);
router.delete('/:date/:entryId', protect, deleteDiaryEntry);

module.exports = router;