const Expense = require("../models/expense");

const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date, notes } = req.body;

        if (!title || amount == null) {
            return res.status(400).json({
                success: false,
                message: "Title and Amount are required"
            });
        }

        const expense = await Expense.create({
            title,
            amount,
            category,
            date,
            notes,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Expense Added Successfully",
            expense
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            user: req.user._id
        }).sort({
            date: -1
        });

        res.status(200).json({
            success: true,
            count: expenses.length,
            expenses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Expense Updated Successfully",
            expense: updatedExpense
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const deleteExpense = async (req, res) => {

    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        await Expense.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Expense Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};