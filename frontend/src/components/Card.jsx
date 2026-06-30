function Card({ children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-white/70 bg-white/65 p-6 shadow-xl shadow-[#3D405B]/5 backdrop-blur-sm ${className}`}>
      {children}
    </section>
  )
}

export default Card
