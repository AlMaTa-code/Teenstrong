export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '', ...props }) {
  const base = "font-semibold px-6 py-3 text-base transition-all duration-200 min-h-[48px] min-w-[44px]";

  const bgStyles = {
    primary: {
      background: disabled ? 'var(--text-muted)' : 'var(--accent)',
      color: '#0d0d0f',
      borderRadius: 'var(--radius)',
    },
    secondary: {
      background: 'transparent',
      border: '1.5px solid var(--accent)',
      color: 'var(--accent)',
      borderRadius: 'var(--radius)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      borderRadius: 'var(--radius)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
      style={bgStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
