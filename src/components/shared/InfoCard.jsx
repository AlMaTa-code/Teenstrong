const typeStyles = {
  safety: { borderColor: 'var(--red)', bg: 'var(--red-dim)', icon: '🛡️', label: 'Safety Tip' },
  hydration: { borderColor: 'var(--blue)', bg: 'rgba(68, 138, 255, 0.12)', icon: '💧', label: 'Hydration' },
  science: { borderColor: 'var(--yellow)', bg: 'rgba(255, 214, 0, 0.12)', icon: '🧠', label: 'Did You Know?' },
};

export default function InfoCard({ type, text }) {
  const style = typeStyles[type] || typeStyles.safety;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: style.bg,
        borderLeft: `3px solid ${style.borderColor}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden="true">{style.icon}</span>
        <span className="text-sm font-semibold" style={{ color: style.borderColor }}>{style.label}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{text}</p>
    </div>
  );
}
