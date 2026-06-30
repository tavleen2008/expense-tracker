import { useState } from 'react'
import AuthCard from '../components/AuthCard'
import api from '../services/api'

const fields = [
  {
    label: 'Email',
    name: 'email',
    placeholder: 'you@example.com',
    type: 'email',
  },
  {
    label: 'Password',
    name: 'password',
    placeholder: 'Enter your password',
    type: 'password',
  },
]

function LoginPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (formData) => {
    try {
      setError('')
      setIsLoading(true)

      const response = await api.post('/auth/login', formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      actionLabel="Login"
      error={error}
      fields={fields}
      footerLinkLabel="Register"
      footerTo="/register"
      footerText="Don't have an account?"
      isLoading={isLoading}
      onSubmit={handleLogin}
      title="Login"
    />
  )
}

export default LoginPage
