export default function Card({ children, className = '', padding = 'p-5', ...props }) {
  return (
    <div
      className={`${padding} ${className}`}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
