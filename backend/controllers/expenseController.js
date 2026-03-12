const { validationResult } = require('express-validator');
const Expense = require('../models/Expense');

// @route   POST /api/expenses
// @desc    Add a new expense
// @access  Private
const addExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, amount, category, date, note } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date) : new Date(),
      note: note ? note.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully!',
      expense
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ success: false, message: 'Server error adding expense.' });
  }
};

// @route   GET /api/expenses
// @desc    Get all expenses for logged-in user
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, sort = 'desc', month } = req.query;

    const filter = { user: req.user._id };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: sort === 'asc' ? 1 : -1 });

    // Analytics summary
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryBreakdown = {};
    expenses.forEach(e => {
      categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
    });

    res.json({
      success: true,
      count: expenses.length,
      total,
      categoryBreakdown,
      expenses
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching expenses.' });
  }
};

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Private
const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }
    res.json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, amount: parseFloat(amount), category, date: new Date(date), note },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    res.json({ success: true, message: 'Expense updated!', expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @route   GET /api/expenses/analytics/summary
// @desc    Get analytics data
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = { user: req.user._id };

    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const categoryStats = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    const monthlyStats = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    res.json({ success: true, categoryStats, monthlyStats });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { addExpense, getExpenses, getExpense, updateExpense, deleteExpense, getAnalytics };
