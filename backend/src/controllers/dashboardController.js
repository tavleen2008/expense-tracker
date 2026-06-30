const Expense = require("../models/Expense");

const getDashboardData = async (req, res) => {
  try {
    // Start of current month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    // Date 30 days ago
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [
      totalExpense,
      thisMonthExpense,
      last30DaysExpense,
      recentExpenses,
      categoryBreakdown,
      monthlyExpenses,
      totalTransactions,
    ] = await Promise.all([
      // Total Expenses
      Expense.aggregate([
        {
          $match: {
            user: req.user.id,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // This Month Expenses
      Expense.aggregate([
        {
          $match: {
            user: req.user.id,
            date: {
              $gte: startOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Last 30 Days Expenses
      Expense.aggregate([
        {
          $match: {
            user: req.user.id,
            date: {
              $gte: last30Days,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Recent Expenses
      Expense.find({
        user: req.user.id,
      })
        .sort({ date: -1 })
        .limit(5),

      // Category Breakdown
      Expense.aggregate([
        {
          $match: {
            user: req.user.id,
          },
        },
        {
          $group: {
            _id: "$category",
            total: {
              $sum: "$amount",
            },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            total: 1,
          },
        },
      ]),

      // Monthly Expenses
      Expense.aggregate([
        {
          $match: {
            user: req.user.id,
          },
        },
        {
          $group: {
            _id: {
              $month: "$date",
            },
            total: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      // Total Transactions
      Expense.countDocuments({
        user: req.user.id,
      }),
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalExpenses: totalExpense[0]?.total || 0,
        thisMonthExpenses: thisMonthExpense[0]?.total || 0,
        last30DaysExpenses: last30DaysExpense[0]?.total || 0,
        totalTransactions,
      },
      recentExpenses,
      categoryBreakdown,
      monthlyExpenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};