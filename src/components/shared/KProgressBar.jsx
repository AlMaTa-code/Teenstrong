/**
 * KALDR segmented progress bar with angled segments.
 * @param {number} total - Total number of segments (3–5)
 * @param {number} filled - Number of filled (active) segments
 */
export default function KProgressBar({ total = 3, filled = 0 }) {
  const clamped = Math.max(3, Math.min(5, total));
  const skew = -12;

  return (
    <div
      className="flex w-full"
      style={{ gap: 4, height: 8 }}
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={clamped}
    >
      {Array.from({ length: clamped }).map((_, i) => (
        <div
          key={i}
          className="kpb-segment"
          style={{
            flex: 1,
            height: '100%',
            background: i < filled ? 'var(--accent)' : 'var(--bg-card-hover)',
            transform: `skewX(${skew}deg)`,
            borderRadius: 2,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
