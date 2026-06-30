# Expense Tracker

A full-stack expense tracking app with a React frontend and Node.js/Express backend.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (7-day expiry) |

## Features

- Register / Login with JWT authentication
- Add, edit, and delete expenses (title, amount, category, date, notes)
- Dashboard with live summary cards — Last 30 Days, Total Expenses, Transactions
- Category-wise spending donut chart
- Month-wise spending bar chart
- Rate limiting on auth routes (5 attempts / 15 min)

## Project Structure

```
expense-tracker/
├── backend/
│   └── src/
│       ├── config/       # MongoDB connection
│       ├── controllers/  # auth, expense, dashboard logic
│       ├── middleware/   # JWT auth, rate limiter
│       ├── models/       # User, Expense schemas
│       └── routes/       # API routes
└── frontend/
    └── src/
        ├── components/   # Card, charts, auth components
        ├── layouts/      # DashboardLayout
        ├── pages/        # Landing, Login, Register, Dashboard
        └── services/     # Axios API client
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=8080
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`, backend at `http://localhost:8080`.

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/expenses` | ✅ | Get all expenses |
| POST | `/api/expenses` | ✅ | Add expense |
| PUT | `/api/expenses/:id` | ✅ | Update expense |
| DELETE | `/api/expenses/:id` | ✅ | Delete expense |
| GET | `/api/dashboard` | ✅ | Summary + chart data |
