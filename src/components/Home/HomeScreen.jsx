import { useMemo } from 'react';
import PrimaryButton from '../shared/PrimaryButton';
import Card from '../shared/Card';
import KProgressBar from '../shared/KProgressBar';
import InfoCard from '../shared/InfoCard';
import { getTipOfTheDay } from '../../data/tips';

export default function HomeScreen({ profile, program, workoutState, isWorkoutCompleted, getCurrentWeekAndSession, onStartWorkout }) {
  const tip = useMemo(() => getTipOfTheDay(), []);
  const { weekIndex, sessionIndex } = getCurrentWeekAndSession(program);
  const currentWeek = program?.weeks[weekIndex];
  const currentSession = currentWeek?.sessions[sessionIndex];
  const todayCompleted = isWorkoutCompleted(weekIndex, sessionIndex);

  const weekSessions = currentWeek?.sessions || [];
  const completedInWeek = weekSessions.filter((_, i) => isWorkoutCompleted(weekIndex, i)).length;

  const allDone = program?.weeks.every((w, wi) =>
    w.sessions.every((_, si) => isWorkoutCompleted(wi, si))
  );

  return (
    <div className="app-container flex flex-col pb-24 px-4 pt-6" style={{ gap: 24 }}>
      {/* Header */}
      <header>
        <h1 className="text-4xl" style={{ color: 'var(--accent)', lineHeight: 1 }}>KALDR</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {allDone ? 'Program Complete' : currentWeek?.label || 'Your Program'}
        </p>
      </header>

      {/* Disclaimer */}
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        KALDR is for educational purposes only — not medical advice. Talk to a parent/guardian and consider checking with a doctor before starting any new exercise program.
      </p>

      {/* Today's Workout */}
      {!allDone && (
        <Card>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
                {currentWeek?.label?.toUpperCase()}
              </p>
              <h2 className="text-2xl" style={{ lineHeight: 1.1 }}>
                {currentSession?.day} — {currentSession?.label}
              </h2>
            </div>
            {todayCompleted && (
              <span className="text-xs font-semibold px-2 py-1" style={{
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                borderRadius: 6,
              }}>
                DONE
              </span>
            )}
          </div>

          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {currentSession?.exercises.length} exercises · ~{Math.round(currentSession?.exercises.length * 3)} min
          </p>

          <PrimaryButton
            onClick={() => onStartWorkout(weekIndex, sessionIndex)}
            disabled={todayCompleted}
          >
            {todayCompleted ? 'COMPLETED' : 'START WORKOUT'}
          </PrimaryButton>
        </Card>
      )}

      {allDone && (
        <Card className="text-center">
          <h2 className="text-3xl mb-2">PROGRAM COMPLETE</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            You've finished the entire 4-week program. That's a serious achievement.
          </p>
        </Card>
      )}

      {/* Week Progress — segmented bar */}
      <Card padding="p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Week {weekIndex + 1} Progress
          </p>
          <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            {completedInWeek}/{weekSessions.length}
          </p>
        </div>

        <KProgressBar total={weekSessions.length} filled={completedInWeek} />

        <div className="flex mt-3" style={{ gap: 8 }}>
          {weekSessions.map((session, i) => {
            const done = isWorkoutCompleted(weekIndex, i);
            const isCurrent = i === sessionIndex && !todayCompleted;
            return (
              <div
                key={i}
                className="flex-1 text-center py-2"
                style={{
                  background: done ? 'var(--accent-dim)' : isCurrent ? 'var(--bg-card-hover)' : 'var(--bg)',
                  border: isCurrent ? '1px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{session.day}</p>
                <p className="text-sm font-semibold" style={{ color: done ? 'var(--accent)' : 'var(--text)' }}>
                  {done ? '✓' : session.label.split(' ')[0]}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Stats */}
      <div className="flex" style={{ gap: 12 }}>
        {[
          { value: workoutState.currentStreak, label: 'Day Streak', color: 'var(--accent)' },
          { value: workoutState.completedWorkouts.length, label: 'Workouts', color: 'var(--accent)' },
          { value: workoutState.totalMinutes, label: 'Minutes', color: 'var(--accent)' },
        ].map((stat, i) => (
          <Card key={i} padding="p-3" className="flex-1 text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Tip */}
      <InfoCard type={tip.type} text={tip.text} />
    </div>
  );
}
