import { useState, useEffect, useCallback } from 'react';
import { saveState, loadState } from '../utils/storage';

const defaultState = {
  completedWorkouts: [],    // Array of { weekIndex, sessionIndex, completedAt, durationMinutes }
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  totalExercisesDone: 0,
  totalMinutes: 0,
};

export function useWorkout() {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setState(saved);
    }
  }, []);

  const updateState = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveState(next);
      return next;
    });
  }, []);

  const completeWorkout = useCallback((weekIndex, sessionIndex, exerciseCount, durationMinutes) => {
    updateState(prev => {
      const today = new Date().toDateString();
      const lastDate = prev.lastWorkoutDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      let newStreak = prev.currentStreak;
      if (lastDate === today) {
        // Already worked out today, don't increment streak
      } else if (lastDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      const longestStreak = Math.max(prev.longestStreak, newStreak);

      return {
        ...prev,
        completedWorkouts: [
          ...prev.completedWorkouts,
          { weekIndex, sessionIndex, completedAt: new Date().toISOString(), durationMinutes },
        ],
        currentStreak: newStreak,
        longestStreak,
        lastWorkoutDate: today,
        totalExercisesDone: prev.totalExercisesDone + exerciseCount,
        totalMinutes: prev.totalMinutes + durationMinutes,
      };
    });
  }, [updateState]);

  const isWorkoutCompleted = useCallback((weekIndex, sessionIndex) => {
    return state.completedWorkouts.some(
      w => w.weekIndex === weekIndex && w.sessionIndex === sessionIndex
    );
  }, [state.completedWorkouts]);

  const getCompletedCount = useCallback(() => {
    return state.completedWorkouts.length;
  }, [state.completedWorkouts]);

  const getCurrentWeekAndSession = useCallback((program) => {
    if (!program) return { weekIndex: 0, sessionIndex: 0 };
    const startWeek = program.startWeek || 0;

    for (let w = startWeek; w < program.weeks.length; w++) {
      for (let s = 0; s < program.weeks[w].sessions.length; s++) {
        if (!isWorkoutCompleted(w, s)) {
          return { weekIndex: w, sessionIndex: s };
        }
      }
    }
    // All completed — return last
    const lastWeek = program.weeks.length - 1;
    return { weekIndex: lastWeek, sessionIndex: program.weeks[lastWeek].sessions.length - 1 };
  }, [isWorkoutCompleted]);

  return {
    state,
    completeWorkout,
    isWorkoutCompleted,
    getCompletedCount,
    getCurrentWeekAndSession,
  };
}
