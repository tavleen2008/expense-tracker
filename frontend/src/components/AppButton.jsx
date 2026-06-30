import { Link } from 'react-router-dom'

function AppButton({
  children,
  className = '',
  onClick,
  to,
  type = 'button',
  variant = 'primary',
}) {
  const baseClasses =
    'inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-semibold tracking-wide shadow-lg transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#F4F1DE]'

  const variants = {
    primary:
      'bg-[#E07A5F] text-white shadow-[#E07A5F]/25 hover:bg-[#cf6d55] focus:ring-[#E07A5F]/35',
    secondary:
      'bg-[#81B29A] text-white shadow-[#81B29A]/25 hover:bg-[#6fa487] focus:ring-[#81B29A]/35',
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  )
}

export default AppButton
