# Frontend Integration Changes

| Folder | File | Original code / behavior | Added or changed code |
| --- | --- | --- | --- |
| `src/services` | `api.js` | Axios instance only set `baseURL` and JSON headers. | Added a request interceptor that reads `token` from `localStorage` and sends `Authorization: Bearer <token>` on protected requests. |
| `src/components` | `ProtectedRoute.jsx` | File did not exist. | Added a protected route wrapper that redirects to `/login` when `localStorage.token` is missing. |
| `src` | `App.jsx` | `/dashboard` rendered directly. | Wrapped `/dashboard` with `<ProtectedRoute><DashboardPage /></ProtectedRoute>`. |
| `src/components` | `AuthInput.jsx` | Inputs were uncontrolled and used generated names like `full-name`. | Added `name`, `value`, `onChange`, and `required` props so auth forms can submit backend field names like `name`, `email`, and `password`. |
| `src/components` | `AuthCard.jsx` | Submit only navigated to `/dashboard`. | Added async submit handling, `FormData`, loading text, and user-friendly error display. Navigation happens only after successful API response. |
| `src/pages` | `LoginPage.jsx` | Login form did not call backend. | Added `api.post('/auth/login')`, saved `token` and `user` in `localStorage`, and navigated to `/dashboard` after success. |
| `src/pages` | `RegisterPage.jsx` | Register form did not call backend. | Added `api.post('/auth/register')`, saved `token` and `user` in `localStorage`, and navigated to `/dashboard` after success. |
| `src/layouts` | `DashboardLayout.jsx` | User greeting read from `localStorage`, but there was no logout action. | Added `handleLogout()` to remove `token` and `user` from `localStorage`, then navigate to `/`. |
| `src/pages` | `DashboardPage.jsx` | Used hardcoded/partial data and had an invalid backend model import. | Replaced with frontend-only API integration for `GET`, `POST`, `PUT`, and `DELETE /expenses`; added dynamic totals, loading spinner, empty state, edit modal, delete buttons, and friendly errors. |

## Key Code Added

### `src/services/api.js`

```js
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
```

### `src/components/ProtectedRoute.jsx`

```jsx
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### `src/pages/LoginPage.jsx`

```jsx
const response = await api.post('/auth/login', formData)

localStorage.setItem('token', response.data.token)
localStorage.setItem('user', JSON.stringify(response.data.user))
```

### `src/pages/RegisterPage.jsx`

```jsx
const response = await api.post('/auth/register', formData)

localStorage.setItem('token', response.data.token)
localStorage.setItem('user', JSON.stringify(response.data.user))
```

### `src/pages/DashboardPage.jsx`

```jsx
const response = await api.get('/expenses')
setExpenses(response.data.expenses || [])
```

```jsx
await api.post('/expenses', {
  ...form,
  amount: Number(form.amount),
})
```

```jsx
await api.put(`/expenses/${editExpense._id}`, {
  ...form,
  amount: Number(form.amount),
})
```

```jsx
await api.delete(`/expenses/${expenseId}`)
```

### `src/layouts/DashboardLayout.jsx`

```jsx
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};
```
