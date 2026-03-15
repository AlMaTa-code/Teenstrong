import { useMemo } from 'react';
import Button from '../shared/Button';
import InfoCard from '../shared/InfoCard';
import { getTipOfTheDay } from '../../data/tips';
import { getExerciseData } from '../../data/programBuilder';

export default function HomeScreen({ profile, program, workoutState, isWorkoutCompleted, getCurrentWeekAndSession, onStartWorkout }) {
  const tip = useMemo(() => getTipOfTheDay(), []);
  const { weekIndex, sessionIndex } = getCurrentWeekAndSession(program);
  const currentWeek = program?.weeks[weekIndex];
  const currentSession = currentWeek?.sessions[sessionIndex];
  const todayCompleted = isWorkoutCompleted(weekIndex, sessionIndex);

  // Calculate week progress
  const weekSessions = currentWeek?.sessions || [];
  const completedInWeek = weekSessions.filter((_, i) => isWorkoutCompleted(weekIndex, i)).length;

  // Check if entire program is done
  const allDone = program?.weeks.every((w, wi) =>
    w.sessions.every((_, si) => isWorkoutCompleted(wi, si))
  );

  return (
    <div className="app-container flex flex-col gap-5 pb-24 px-4 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl" style={{ color: 'var(--accent)' }}>TEENSTRONG</h1>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {allDone ? 'Program Complete!' : `${currentWeek?.label || 'Your Program'}`}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
          Build confidence. Feel powerful. Get stronger for sports and life.
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
        TeenStrong is for educational purposes only — not medical advice. Talk to a parent/guardian and consider checking with a doctor before starting any new exercise program.
      </p>

      {/* Today's Workout Card */}
      {!allDone && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)' }}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-semibold tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
                {currentWeek?.label?.toUpperCase()}
              </p>
              <h2 className="text-2xl">{currentSession?.day} — {currentSession?.label}</h2>
            </div>
            {todayCompleted && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                Done
              </span>
            )}
          </div>

          <p className="text-sm mb-4" style={{ color: 'var(--text-mid)' }}>
            {currentSession?.exercises.length} exercises · ~{Math.round(currentSession?.exercises.length * 3)} min
          </p>

          <Button
            onClick={() => onStartWorkout(weekIndex, sessionIndex)}
            className="w-full"
            variant={todayCompleted ? 'primary' : 'orange'}
            disabled={todayCompleted}
          >
            {todayCompleted ? 'COMPLETED' : 'START WORKOUT'}
          </Button>
        </div>
      )}

      {allDone && (
        <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--bg-card)' }}>
          <h2 className="text-3xl mb-2">PROGRAM COMPLETE!</h2>
          <p className="text-sm" style={{ color: 'var(--text-mid)' }}>
            You've finished the entire 4-week program. That's a serious achievement.
          </p>
        </div>
      )}

      {/* Week Progress Grid */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-mid)' }}>
          Week {(weekIndex + 1)} Progress
        </p>
        <div className="flex gap-3">
          {weekSessions.map((session, i) => {
            const done = isWorkoutCompleted(weekIndex, i);
            const isCurrent = i === sessionIndex && !todayCompleted;
            return (
              <div
                key={i}
                className="flex-1 rounded-xl p-3 text-center"
                style={{
                  background: done ? 'var(--accent-dim)' : isCurrent ? 'var(--bg-card-hover)' : 'var(--bg)',
                  border: isCurrent ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>{session.day}</p>
                <p className="text-sm font-semibold" style={{ color: done ? 'var(--accent)' : 'var(--text)' }}>
                  {done ? '✓' : session.label.split(' ')[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--orange)' }}>{workoutState.currentStreak}</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Day Streak</p>
        </div>
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{workoutState.completedWorkouts.length}</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Workouts</p>
        </div>
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{workoutState.totalMinutes}</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Minutes</p>
        </div>
      </div>

      {/* Tip of the Day */}
      <InfoCard type={tip.type} text={tip.text} />
    </div>
  );
}
