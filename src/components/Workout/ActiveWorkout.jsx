import { useState, useEffect, useCallback, useRef } from 'react';
import { getExerciseData, getWeightSuggestion } from '../../data/programBuilder';
import { getRestDuration } from '../../utils/timer';
import Button from '../shared/Button';

export default function ActiveWorkout({ session, weekIndex, sessionIndex, onComplete, onExit, profile }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndexes, setCompletedIndexes] = useState(new Set());
  const [showRest, setShowRest] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [undoVisible, setUndoVisible] = useState(false);
  const [lastCompleted, setLastCompleted] = useState(null);
  const [restSkipCount, setRestSkipCount] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const startTimeRef = useRef(Date.now());
  const exerciseStartRef = useRef(Date.now());
  const exerciseLogRef = useRef([]);
  const undoTimerRef = useRef(null);

  const MAX_REST_SKIPS = 2;

  const exerciseIds = session.exercises;
  const total = exerciseIds.length;
  const exerciseData = getExerciseData(exerciseIds[currentIndex]);
  const isLastExercise = currentIndex === total - 1;
  const allDone = completedIndexes.size === total;

  // Reset exercise timer when navigating to a new exercise
  useEffect(() => {
    exerciseStartRef.current = Date.now();
  }, [currentIndex]);

  // Rest timer countdown
  useEffect(() => {
    if (!showRest || restTime <= 0) return;
    const interval = setInterval(() => {
      setRestTime(t => {
        if (t <= 1) {
          clearInterval(interval);
          setShowRest(false);
          if (!isLastExercise) {
            setCurrentIndex(i => i + 1);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showRest, restTime, isLastExercise]);

  const logExercise = useCallback((idx, status) => {
    const durationSeconds = Math.round((Date.now() - exerciseStartRef.current) / 1000);
    exerciseLogRef.current.push({
      exerciseId: exerciseIds[idx],
      status,
      durationSeconds,
    });
  }, [exerciseIds]);

  const markDone = useCallback(() => {
    const idx = currentIndex;
    logExercise(idx, 'completed');
    setCompletedIndexes(prev => new Set([...prev, idx]));
    setLastCompleted(idx);

    setUndoVisible(true);
    clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoVisible(false), 5000);

    if (idx === total - 1) {
      return;
    }

    const exercise = getExerciseData(exerciseIds[idx]);
    const restDuration = getRestDuration(exercise);
    setRestTime(restDuration);
    setShowRest(true);
  }, [currentIndex, total, exerciseIds, logExercise]);

  const handleUndo = useCallback(() => {
    if (lastCompleted !== null) {
      setCompletedIndexes(prev => {
        const next = new Set(prev);
        next.delete(lastCompleted);
        return next;
      });
      exerciseLogRef.current.pop();
      setCurrentIndex(lastCompleted);
      setShowRest(false);
      setUndoVisible(false);
      setLastCompleted(null);
    }
  }, [lastCompleted]);

  const skipRest = () => {
    setRestSkipCount(c => c + 1);
    setShowRest(false);
    setRestTime(0);
    if (!isLastExercise) {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleFinish = () => {
    const durationMinutes = Math.round((Date.now() - startTimeRef.current) / 60000);
    const exerciseCount = completedIndexes.size;
    onComplete(weekIndex, sessionIndex, exerciseCount, durationMinutes, {
      exerciseLog: exerciseLogRef.current,
      difficulty,
      restSkipsUsed: restSkipCount,
      startedAt: new Date(startTimeRef.current).toISOString(),
    });
  };

  // Weight suggestion for dumbbell exercises
  const weightSuggestion = profile?.weightKg
    ? getWeightSuggestion(profile.weightKg, exerciseIds[currentIndex], profile.weightUnit)
    : null;

  // Difficulty feedback screen (shown after all exercises done, before celebration)
  if (allDone && difficulty === null) {
    return (
      <div className="app-container min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'var(--bg)' }}>
        <h1 className="text-3xl mb-2">HOW DID THAT FEEL?</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-mid)' }}>
          This helps us fine-tune your program over time.
        </p>
        <div className="flex flex-col gap-3 w-full">
          {[
            { value: 'too_easy', label: 'Too Easy', desc: 'I could have done way more' },
            { value: 'just_right', label: 'Just Right', desc: 'Challenging but doable' },
            { value: 'too_hard', label: 'Too Hard', desc: 'I struggled to finish' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className="w-full rounded-xl p-4 text-left transition-all min-h-[44px]"
              style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <p className="text-base font-semibold">{opt.label}</p>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Workout complete overlay
  if (allDone && difficulty !== null) {
    const durationMinutes = Math.round((Date.now() - startTimeRef.current) / 60000);
    return (
      <div className="app-container min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'var(--bg)' }}>
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl mb-2" style={{ color: 'var(--accent)' }}>WORKOUT COMPLETE!</h1>
        <p className="text-lg mb-6" style={{ color: 'var(--text-mid)' }}>
          {session.label} — {total} exercises in {durationMinutes || 1} min
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-dim)' }}>
          Consistency beats intensity. You showed up — that's what matters.
        </p>
        <Button onClick={handleFinish} className="w-full">DONE</Button>
      </div>
    );
  }

  // Rest timer overlay
  if (showRest) {
    const canSkipRest = restSkipCount < MAX_REST_SKIPS;
    return (
      <div className="app-container min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'var(--bg)' }}>
        <p className="text-sm mb-4" style={{ color: 'var(--text-mid)' }}>REST</p>
        <div className="text-8xl font-bold mb-6" style={{ fontFamily: 'Bebas Neue', color: 'var(--accent)' }}>
          {restTime}
        </div>
        <p className="text-sm mb-8" style={{ color: 'var(--text-dim)' }}>
          {canSkipRest
            ? 'Shake it out. Breathe. Get ready for the next one.'
            : 'No more skips — let your muscles recover!'}
        </p>
        {canSkipRest && (
          <div className="flex flex-col items-center gap-2">
            <Button variant="secondary" onClick={skipRest}>SKIP REST</Button>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {MAX_REST_SKIPS - restSkipCount} skip{MAX_REST_SKIPS - restSkipCount !== 1 ? 's' : ''} remaining
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onExit} className="text-sm min-w-[44px] min-h-[44px] flex items-center bg-transparent"
          style={{ color: 'var(--text-mid)' }} aria-label="Exit workout">
          ← Exit
        </button>
        <span className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: 'var(--bg-card)' }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${(completedIndexes.size / total) * 100}%`,
            background: 'var(--accent)',
          }}
        />
      </div>

      {/* Exercise Card */}
      <div className="flex-1 flex flex-col justify-center px-5 py-6">
        {exerciseData && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
                {exerciseData.muscle}
              </p>
              <h2 className="text-3xl">{exerciseData.name}</h2>
              <p className="text-lg mt-1" style={{ color: 'var(--text-mid)' }}>
                {exerciseData.sets}
              </p>
              {weightSuggestion && (
                <p className="text-sm mt-1" style={{ color: 'var(--blue)' }}>
                  Suggested: {weightSuggestion}
                </p>
              )}
            </div>

            <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>Form</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                {exerciseData.form}
              </p>
            </div>

            {exerciseData.safety && (
              <div className="rounded-xl p-4" style={{ background: 'var(--red-dim)', borderLeft: '3px solid var(--red)' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--red)' }}>⚠ Safety</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                  {exerciseData.safety}
                </p>
              </div>
            )}

            {!exerciseData.isWarmup && !exerciseData.isCooldown && (
              <p className="text-xs italic" style={{ color: 'var(--text-dim)' }}>
                Stop when you feel you could do 2-3 more reps. Muscle burn = normal. Sharp joint pain = stop immediately.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-5 pb-8">
        {completedIndexes.has(currentIndex) ? (
          <div className="flex gap-3">
            {currentIndex < total - 1 && (
              <Button onClick={() => setCurrentIndex(i => i + 1)} className="w-full">
                NEXT
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={markDone} className="w-full">
            DONE ✓
          </Button>
        )}

        {/* Navigation dots */}
        <div className="flex justify-center gap-1 mt-4 flex-wrap">
          {exerciseIds.map((_, i) => (
            <button
              key={i}
              onClick={() => { setShowRest(false); setCurrentIndex(i); }}
              className="w-3 h-3 rounded-full min-w-[12px] min-h-[12px]"
              style={{
                background: completedIndexes.has(i)
                  ? 'var(--accent)'
                  : i === currentIndex
                    ? 'var(--text)'
                    : 'var(--text-dim)',
              }}
              aria-label={`Exercise ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Undo Toast */}
      {undoVisible && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg z-50"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <span className="text-sm" style={{ color: 'var(--text)' }}>Exercise completed</span>
          <button
            onClick={handleUndo}
            className="text-sm font-semibold min-h-[44px] px-2 bg-transparent"
            style={{ color: 'var(--accent)' }}
          >
            UNDO
          </button>
        </div>
      )}
    </div>
  );
}
