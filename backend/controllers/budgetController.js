const Budget = require('../models/Budget');

// @route   GET /api/budget
// @desc    Get user's budget
// @access  Private
const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ user: req.user._id });
    res.json({
      success: true,
      budget: budget ? { amount: budget.amount, month: budget.month } : { amount: 10000, month: new Date().toISOString().slice(0, 7) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @route   POST /api/budget
// @desc    Set or update user's budget
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ success: false, message: 'Valid budget amount is required.' });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id },
      { amount: parseFloat(amount), month: new Date().toISOString().slice(0, 7) },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: 'Budget updated successfully!', budget });
  } catch (error) {
    console.error('Budget error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getBudget, setBudget };
