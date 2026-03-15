export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '', ...props }) {
  const base = "font-semibold rounded-xl px-6 py-3 text-base transition-all duration-200 min-h-[44px] min-w-[44px]";

  const variants = {
    primary: "text-black",
    orange: "text-black",
    secondary: "border",
    ghost: "bg-transparent",
  };

  const bgStyles = {
    primary: {
      background: disabled ? 'var(--text-dim)' : 'var(--accent)',
      color: '#000',
    },
    orange: {
      background: disabled ? 'var(--text-dim)' : 'var(--orange)',
      color: '#000',
    },
    secondary: {
      background: 'transparent',
      borderColor: 'var(--accent)',
      color: 'var(--accent)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-mid)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      style={bgStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
