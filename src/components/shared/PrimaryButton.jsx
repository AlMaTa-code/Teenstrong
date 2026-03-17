export default function PrimaryButton({ children, onClick, disabled = false, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold text-base tracking-wide uppercase transition-all duration-200 min-h-[48px] w-full ${className}`}
      style={{
        background: disabled ? 'var(--text-muted)' : 'var(--accent)',
        color: 'var(--bg)',
        borderRadius: 'var(--radius)',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
