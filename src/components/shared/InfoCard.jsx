const typeStyles = {
  safety: { borderColor: 'var(--blue)', bg: 'var(--blue-dim)', icon: '🛡️', label: 'Safety Tip' },
  hydration: { borderColor: 'var(--blue)', bg: 'var(--blue-dim)', icon: '💧', label: 'Hydration' },
  science: { borderColor: 'var(--yellow)', bg: 'rgba(255, 214, 0, 0.08)', icon: '🧠', label: 'Did You Know?' },
};

export default function InfoCard({ type, text }) {
  const style = typeStyles[type] || typeStyles.safety;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderLeft: `3px solid ${style.borderColor}`,
        borderRadius: 'var(--radius)',
        padding: 16,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden="true">{style.icon}</span>
        <span className="text-sm font-semibold" style={{ color: style.borderColor }}>{style.label}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
    </div>
  );
}
