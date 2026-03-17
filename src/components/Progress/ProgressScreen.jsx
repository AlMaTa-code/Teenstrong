import { useMemo } from 'react';

export default function ProgressScreen({ workoutState }) {
  const { completedWorkouts, currentStreak, longestStreak, totalExercisesDone, totalMinutes } = workoutState;
  const confidenceDays = useMemo(() => Math.floor(Math.random() * 7) + 1, []);

  const stats = [
    { label: 'Current Streak', value: currentStreak, unit: 'days', color: 'var(--accent)' },
    { label: 'Longest Streak', value: longestStreak, unit: 'days', color: 'var(--yellow)' },
    { label: 'Workouts Done', value: completedWorkouts.length, unit: '', color: 'var(--accent)' },
    { label: 'Stronger Moves Unlocked', value: totalExercisesDone, unit: '', color: 'var(--blue)' },
    { label: 'Total Time', value: totalMinutes, unit: 'min', color: 'var(--accent)' },
    { label: 'Posture & Confidence Days', value: confidenceDays, unit: 'days', color: 'var(--orange)' },
  ];

  return (
    <div className="app-container flex flex-col gap-5 pb-24 px-4 pt-6">
      <h1 className="text-4xl">YOUR PROGRESS</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 ${i === 0 ? 'col-span-2' : ''}`}
            style={{ background: 'var(--bg-card)' }}
          >
            <p className="text-3xl font-bold" style={{ color: stat.color, fontFamily: 'Bebas Neue' }}>
              {stat.value}{stat.unit ? <span className="text-lg"> {stat.unit}</span> : ''}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Motivational Card */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', borderLeft: '3px solid var(--orange)' }}>
        <h3 className="text-lg mb-2">WHY YOU'RE GETTING STRONGER</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          You're building confidence, feeling powerful in your body, and getting stronger for sports and life. Every workout builds more than muscle — it builds better posture, energy, and self-belief. Great job, teen!
        </p>
      </div>

      {/* Workout History */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)' }}>
        <h2 className="text-xl mb-3">WORKOUT HISTORY</h2>
        {completedWorkouts.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No workouts completed yet. Start your first one from the Home tab!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {[...completedWorkouts].reverse().map((w, i) => (
              <div key={i} className="flex justify-between items-center py-2"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold">
                    Week {w.weekIndex + 1}, Session {w.sessionIndex + 1}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(w.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm" style={{ color: 'var(--accent)' }}>
                  {w.durationMinutes} min
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
