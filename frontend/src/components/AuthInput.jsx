function AuthInput({ label, name, onChange, placeholder, required = true, type = 'text', value }) {
  const id = label.toLowerCase().replaceAll(' ', '-')

  return (
    <label className="block text-left" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-[#3D405B]">
        {label}
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-[#3D405B]/10 bg-white/80 px-4 text-[#3D405B] outline-none transition duration-300 placeholder:text-[#3D405B]/40 focus:border-[#81B29A] focus:bg-white focus:ring-4 focus:ring-[#81B29A]/20"
        id={id}
        name={name || id}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  )
}

export default AuthInput
