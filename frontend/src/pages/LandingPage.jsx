import AppButton from '../components/AppButton'

function LandingPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-5 py-12 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(242,204,143,0.45),_transparent_34%),linear-gradient(135deg,_rgba(244,241,222,1)_0%,_rgba(244,241,222,0.92)_54%,_rgba(129,178,154,0.28)_100%)]" />

      <div className="relative z-10 mx-auto flex max-w-4xl animate-[fadeIn_800ms_ease-out] flex-col items-center">
        <h1 className="text-5xl font-black tracking-normal text-[#3D405B] sm:text-6xl md:text-7xl">
          Expense Tracker
        </h1>

        <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#3D405B]/75 sm:text-xl">
          Track your expenses before your bank surprises you.
        </p>

        <div className="mt-9 flex w-full max-w-sm flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
          <AppButton className="w-full sm:w-auto" to="/register" variant="primary">
            Get Started
          </AppButton>
          <AppButton className="w-full sm:w-auto" to="/login" variant="secondary">
            Login
          </AppButton>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
