import Button from '../shared/Button';

export default function ProgramScreen({ program, isWorkoutCompleted, onStartWorkout }) {
  if (!program) return null;

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-6" style={{ maxWidth: 430, margin: '0 auto' }}>
      <h1 className="text-4xl">YOUR PROGRAM</h1>
      <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
        4-week progressive program based on AAP & NSCA guidelines. 3 sessions per week on non-consecutive days.
      </p>

      {program.weeks.map((week, wi) => (
        <div key={wi} className="rounded-2xl p-4" style={{ background: 'var(--bg-card)' }}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl">{week.label}</h2>
            <span className="text-xs px-2 py-1 rounded-full" style={{
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
            }}>
              {week.equipment}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {week.sessions.map((session, si) => {
              const done = isWorkoutCompleted(wi, si);
              return (
                <div
                  key={si}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: done ? 'var(--accent-dim)' : 'var(--bg)',
                    border: `1px solid ${done ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg" style={{ color: done ? 'var(--accent)' : 'var(--text-dim)' }}>
                      {done ? '✓' : '○'}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: done ? 'var(--accent)' : 'var(--text)' }}>
                        {session.day}: {session.label}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                        {session.exercises.length} exercises
                      </p>
                    </div>
                  </div>
                  {!done && (
                    <button
                      onClick={() => onStartWorkout(wi, si)}
                      className="text-xs font-semibold px-3 py-2 rounded-lg min-h-[44px] bg-transparent"
                      style={{ color: 'var(--accent)' }}
                    >
                      START
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
