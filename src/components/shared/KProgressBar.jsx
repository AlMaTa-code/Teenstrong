import { useEffect, useState } from 'react';

/**
 * KALDR segmented progress bar with angled segments.
 * @param {number} total - Total number of segments (3–5)
 * @param {number} filled - Number of filled (active) segments
 */
export default function KProgressBar({ total = 3, filled = 0 }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const clamped = Math.max(3, Math.min(5, total));
  const segWidth = 100 / clamped;
  const skew = -12;
  const gap = 4;

  return (
    <div
      className="flex w-full"
      style={{ gap: `${gap}px`, height: 8 }}
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={clamped}
    >
      {Array.from({ length: clamped }).map((_, i) => {
        const active = i < filled;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: '100%',
              background: active ? 'var(--accent)' : 'var(--bg-card-hover)',
              transform: `skewX(${skew}deg)`,
              borderRadius: 2,
              transition: animated ? 'none' : `background 0.4s ease ${i * 0.1}s`,
              opacity: animated ? 1 : 0,
              animation: `kpb-in 0.35s ease ${i * 0.08}s forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes kpb-in {
          from { opacity: 0; transform: skewX(${skew}deg) scaleX(0.3); }
          to   { opacity: 1; transform: skewX(${skew}deg) scaleX(1); }
        }
      `}</style>
    </div>
  );
}
