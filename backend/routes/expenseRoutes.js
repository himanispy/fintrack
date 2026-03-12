const express = require('express');
const { body } = require('express-validator');
const {
  addExpense, getExpenses, getExpense, updateExpense, deleteExpense, getAnalytics
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

router.get('/analytics/summary', getAnalytics);
router.get('/', getExpenses);
router.get('/:id', getExpense);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isNumeric().withMessage('Valid amount is required').custom(v => v > 0).withMessage('Amount must be positive'),
  body('category').isIn(['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']).withMessage('Invalid category'),
  body('date').optional().isISO8601().withMessage('Valid date is required')
], addExpense);

router.put('/:id', [
  body('title').optional().trim().notEmpty(),
  body('amount').optional().isNumeric().custom(v => v > 0),
  body('category').optional().isIn(['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'])
], updateExpense);

router.delete('/:id', deleteExpense);

module.exports = router;
