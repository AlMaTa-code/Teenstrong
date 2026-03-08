export default function ProgressScreen({ workoutState }) {
  const { completedWorkouts, currentStreak, longestStreak, totalExercisesDone, totalMinutes } = workoutState;

  const stats = [
    { label: 'Current Streak', value: currentStreak, unit: 'days', color: 'var(--accent)' },
    { label: 'Longest Streak', value: longestStreak, unit: 'days', color: 'var(--yellow)' },
    { label: 'Workouts Done', value: completedWorkouts.length, unit: '', color: 'var(--accent)' },
    { label: 'Exercises Done', value: totalExercisesDone, unit: '', color: 'var(--blue)' },
    { label: 'Total Time', value: totalMinutes, unit: 'min', color: 'var(--accent)' },
  ];

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-6" style={{ maxWidth: 430, margin: '0 auto' }}>
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
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Workout History */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)' }}>
        <h2 className="text-xl mb-3">WORKOUT HISTORY</h2>
        {completedWorkouts.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
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
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
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
