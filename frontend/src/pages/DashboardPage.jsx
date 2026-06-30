import { useEffect, useState } from 'react'
import Card from '../components/Card'
import CategoryPieChart from '../components/CategoryPieChart'
import MonthlyBarChart from '../components/MonthlyBarChart'
import DashboardLayout from '../layouts/DashboardLayout'
import api from '../services/api'

const emptyExpenseForm = {
  amount: '',
  category: '',
  date: '',
  notes: '',
  title: '',
}

const categories = [
  { label: 'Food', value: 'food' },
  { label: 'Travel', value: 'travel' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Bills', value: 'bills' },
  { label: 'Health', value: 'health' },
  { label: 'Other', value: 'other' },
]

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    currency: 'USD',
    style: 'currency',
  })
}

function formatDate(date) {
  if (!date) {
    return 'No date'
  }

  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function toInputDate(date) {
  if (!date) {
    return ''
  }

  return new Date(date).toISOString().split('T')[0]
}

function DashboardPage() {
  const [editExpense, setEditExpense] = useState(null)
  const [error, setError] = useState('')
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState(emptyExpenseForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dashboardSummary, setDashboardSummary] = useState({
    totalExpenses: 0,
    thisMonthExpenses: 0,
    last30DaysExpenses: 0,
    totalTransactions: 0,
  })
  const [chartData, setChartData] = useState({
    categoryBreakdown: [],
    monthlyExpenses: [],
  })

  const summaryCards = [
    {
      accent: 'bg-[#81B29A]',
      label: 'Last 30 Days',
      value: formatCurrency(dashboardSummary.last30DaysExpenses),
    },
    {
      accent: 'bg-[#F2CC8F]',
      label: 'Transactions',
      value: String(dashboardSummary.totalTransactions),
    },
    {
      accent: 'bg-[#E07A5F]',
      label: 'Total Expenses',
      value: formatCurrency(dashboardSummary.totalExpenses),
    },
  ]

  const fetchExpenses = async () => {
    try {
      setError('')
      setIsLoading(true)

      const expensesRes = await api.get('/expenses')
      setExpenses(expensesRes.data.expenses || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load expenses. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDashboardSummary = async () => {
    try {
      const dashboardRes = await api.get('/dashboard')
      if (dashboardRes.data?.summary) {
        setDashboardSummary(dashboardRes.data.summary)
      }
      if (dashboardRes.data?.categoryBreakdown) {
        setChartData((prev) => ({
          ...prev,
          categoryBreakdown: dashboardRes.data.categoryBreakdown,
        }))
      }
      if (dashboardRes.data?.monthlyExpenses) {
        setChartData((prev) => ({
          ...prev,
          monthlyExpenses: dashboardRes.data.monthlyExpenses,
        }))
      }
    } catch (err) {
      console.error('Dashboard summary fetch failed:', err.response?.data || err.message)
    }
  }

  useEffect(() => {
    fetchExpenses()
    fetchDashboardSummary()
  }, [])

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleAddExpense = async (event) => {
    event.preventDefault()

    try {
      setError('')
      setIsSaving(true)
      await api.post('/expenses', {
        ...form,
        amount: Number(form.amount),
      })
      setForm(emptyExpenseForm)
      await fetchExpenses()
      fetchDashboardSummary()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add expense. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    try {
      setError('')
      await api.delete(`/expenses/${expenseId}`)
      await fetchExpenses()
      fetchDashboardSummary()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete expense. Please try again.')
    }
  }

  const openEditModal = (expense) => {
    setEditExpense(expense)
    setForm({
      amount: expense.amount || '',
      category: expense.category || '',
      date: toInputDate(expense.date),
      notes: expense.notes || '',
      title: expense.title || '',
    })
  }

  const closeEditModal = () => {
    setEditExpense(null)
    setForm(emptyExpenseForm)
  }

  const handleUpdateExpense = async (event) => {
    event.preventDefault()

    try {
      setError('')
      setIsSaving(true)
      await api.put(`/expenses/${editExpense._id}`, {
        ...form,
        amount: Number(form.amount),
      })
      closeEditModal()
      await fetchExpenses()
      fetchDashboardSummary()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update expense. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const expenseForm = (
    <form className="mt-5 space-y-4" onSubmit={editExpense ? handleUpdateExpense : handleAddExpense}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold text-[#3D405B]" htmlFor={editExpense ? 'edit-title' : 'title'}>
          Title
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-[#3D405B]/10 bg-white/80 px-4 outline-none transition focus:border-[#81B29A] focus:ring-4 focus:ring-[#81B29A]/20"
            id={editExpense ? 'edit-title' : 'title'}
            name="title"
            onChange={handleFormChange}
            placeholder="Pizza"
            required
            type="text"
            value={form.title}
          />
        </label>

        <label className="block text-sm font-bold text-[#3D405B]" htmlFor={editExpense ? 'edit-amount' : 'amount'}>
          Amount
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-[#3D405B]/10 bg-white/80 px-4 outline-none transition focus:border-[#81B29A] focus:ring-4 focus:ring-[#81B29A]/20"
            id={editExpense ? 'edit-amount' : 'amount'}
            min="0"
            name="amount"
            onChange={handleFormChange}
            placeholder="$0.00"
            required
            step="0.01"
            type="number"
            value={form.amount}
          />
        </label>

        <label className="block text-sm font-bold text-[#3D405B]" htmlFor={editExpense ? 'edit-category' : 'category'}>
          Category
          <select
            className="mt-2 h-12 w-full rounded-2xl border border-[#3D405B]/10 bg-white/80 px-4 outline-none transition focus:border-[#81B29A] focus:ring-4 focus:ring-[#81B29A]/20"
            id={editExpense ? 'edit-category' : 'category'}
            name="category"
            onChange={handleFormChange}
            required
            value={form.category}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-bold text-[#3D405B]" htmlFor={editExpense ? 'edit-date' : 'date'}>
          Date
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-[#3D405B]/10 bg-white/80 px-4 outline-none transition focus:border-[#81B29A] focus:ring-4 focus:ring-[#81B29A]/20"
            id={editExpense ? 'edit-date' : 'date'}
            name="date"
            onChange={handleFormChange}
            type="date"
            value={form.date}
          />
        </label>
      </div>

      <label className="block text-sm font-bold text-[#3D405B]" htmlFor={editExpense ? 'edit-notes' : 'description'}>
        Description
        <input
          className="mt-2 h-12 w-full rounded-2xl border border-[#3D405B]/10 bg-white/80 px-4 outline-none transition focus:border-[#81B29A] focus:ring-4 focus:ring-[#81B29A]/20"
          id={editExpense ? 'edit-notes' : 'description'}
          name="notes"
          onChange={handleFormChange}
          placeholder="Dinner with friends"
          type="text"
          value={form.notes}
        />
      </label>

      <button
        className="h-12 w-full rounded-full bg-[#E07A5F] px-6 text-sm font-black text-white shadow-lg shadow-[#E07A5F]/25 transition hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-[#cf6d55] focus:outline-none focus:ring-4 focus:ring-[#E07A5F]/30"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? 'Saving...' : editExpense ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  )

  return (
    <DashboardLayout>
      <div className="animate-[fadeIn_700ms_ease-out] space-y-8">
        {error && (
          <p className="rounded-2xl bg-[#E07A5F]/10 px-5 py-4 text-sm font-semibold text-[#E07A5F]">
            {error}
          </p>
        )}

        <section className="grid gap-5 md:grid-cols-3">
          {summaryCards.map((card) => (
            <Card key={card.label}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#3D405B]/55">
                    {card.label}
                  </p>
                  <p className="mt-3 text-3xl font-black text-[#3D405B]">
                    {card.value}
                  </p>
                </div>
                <span className={`h-11 w-2 rounded-full ${card.accent}`} />
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl font-black text-[#3D405B]">
                Recent Transactions
              </h1>
              <span className="rounded-full bg-[#81B29A]/20 px-3 py-1 text-xs font-bold text-[#3D405B]/65">
                {expenses.length} transactions
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#81B29A]/30 border-t-[#E07A5F]" />
                </div>
              ) : expenses.length === 0 ? (
                <p className="py-8 text-center text-[#3D405B]/60">
                  No expenses found.
                </p>
              ) : (
                expenses.slice(0, 5).map((expense) => (
                  <article
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3D405B]/5"
                    key={expense._id}
                  >
                    <div>
                      <h2 className="font-bold capitalize text-[#3D405B]">
                        {expense.category || 'Other'}
                      </h2>

                      <p className="mt-1 text-sm text-[#3D405B]/55">
                        {expense.title}
                      </p>

                      <p className="text-xs text-[#3D405B]/40">
                        {formatDate(expense.date)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-[#E07A5F]">
                        {formatCurrency(expense.amount)}
                      </p>
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          className="rounded-full bg-[#81B29A]/20 px-3 py-1 text-xs font-bold text-[#3D405B] transition hover:bg-[#81B29A]/35"
                          onClick={() => openEditModal(expense)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-full bg-[#E07A5F]/15 px-3 py-1 text-xs font-bold text-[#E07A5F] transition hover:bg-[#E07A5F]/25"
                          onClick={() => handleDeleteExpense(expense._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h1 className="text-xl font-black text-[#3D405B]">Expense Form</h1>
            {expenseForm}
          </Card>
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <CategoryPieChart data={chartData.categoryBreakdown} />
          <MonthlyBarChart data={chartData.monthlyExpenses} />
        </section>
      </div>

      {editExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D405B]/35 px-5 py-8 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-[#F4F1DE] p-6 shadow-2xl shadow-[#3D405B]/20">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black text-[#3D405B]">Edit Expense</h2>
              <button
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-[#3D405B] transition hover:bg-white"
                onClick={closeEditModal}
                type="button"
              >
                Close
              </button>
            </div>
            {expenseForm}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default DashboardPage
