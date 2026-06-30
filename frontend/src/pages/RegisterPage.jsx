import { useState } from 'react'
import AuthCard from '../components/AuthCard'
import api from '../services/api'

const fields = [
  {
    label: 'Full Name',
    name: 'name',
    placeholder: 'Alex Morgan',
  },
  {
    label: 'Email',
    name: 'email',
    placeholder: 'you@example.com',
    type: 'email',
  },
  {
    label: 'Password',
    name: 'password',
    placeholder: 'Create a password',
    type: 'password',
  },
]

function RegisterPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (formData) => {
    try {
      setError('')
      setIsLoading(true)

      const response = await api.post('/auth/register', formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      return true
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      actionLabel="Register"
      error={error}
      fields={fields}
      footerLinkLabel="Login"
      footerTo="/login"
      footerText="Already have an account?"
      isLoading={isLoading}
      onSubmit={handleRegister}
      title="Register"
    />
  )
}

export default RegisterPage
