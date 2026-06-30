import AppButton from './AppButton'
import AuthInput from './AuthInput'
import { Link, useNavigate } from 'react-router-dom'

function AuthCard({
  actionLabel,
  actionTo = '/dashboard',
  error,
  fields,
  footerLinkLabel,
  footerText,
  footerTo,
  isLoading,
  onSubmit,
  title,
}) {
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(event.currentTarget))
    const success = await onSubmit(formData)

    if (success) {
      navigate(actionTo)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md animate-[fadeIn_700ms_ease-out] rounded-[2rem] border border-white/60 bg-white/55 p-7 text-center shadow-2xl shadow-[#3D405B]/10 backdrop-blur-md sm:p-9">
        <Link
          className="mb-8 inline-flex text-sm font-semibold text-[#3D405B]/65 transition hover:text-[#E07A5F]"
          to="/"
        >
          Expense Tracker
        </Link>

        <h1 className="text-3xl font-bold text-[#3D405B] sm:text-4xl">
          {title}
        </h1>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <AuthInput key={field.label} {...field} />
          ))}

          {error && (
            <p className="rounded-2xl bg-[#E07A5F]/10 px-4 py-3 text-sm font-semibold text-[#E07A5F]">
              {error}
            </p>
          )}

          <AppButton className="mt-3 w-full" type="submit" variant="primary">
            {isLoading ? 'Please wait...' : actionLabel}
          </AppButton>
        </form>

        <p className="mt-7 text-sm text-[#3D405B]/70">
          {footerText}{' '}
          <Link
            className="font-bold text-[#E07A5F] transition hover:text-[#81B29A]"
            to={footerTo}
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </section>
  )
}

export default AuthCard
