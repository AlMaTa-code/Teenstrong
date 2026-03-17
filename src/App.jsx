import { useState, useCallback, useEffect } from 'react';
import { useProfile } from './hooks/useProfile';
import { useWorkout } from './hooks/useWorkout';
import { saveAnalyticsEvent } from './utils/storage';
import Onboarding from './components/Onboarding/Onboarding';
import HomeScreen from './components/Home/HomeScreen';
import ActiveWorkout from './components/Workout/ActiveWorkout';
import ProgramScreen from './components/Program/ProgramScreen';
import ProgressScreen from './components/Progress/ProgressScreen';
import BottomNav from './components/shared/BottomNav';

export default function App() {
  const { profile, program, isLoading, createProfile, resetProfile } = useProfile();
  const { state: workoutState, completeWorkout, isWorkoutCompleted, getCompletedCount, getCurrentWeekAndSession } = useWorkout();

  const [activeTab, setActiveTab] = useState('home');
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Track app opens
  useEffect(() => {
    saveAnalyticsEvent({ type: 'app_open' });
  }, []);

  const handleOnboardingComplete = useCallback((data) => {
    createProfile(data);
  }, [createProfile]);

  const handleStartWorkout = useCallback((weekIndex, sessionIndex) => {
    setActiveWorkout({ weekIndex, sessionIndex });
    saveAnalyticsEvent({ type: 'workout_start', weekIndex, sessionIndex });
  }, []);

  const handleWorkoutComplete = useCallback((weekIndex, sessionIndex, exerciseCount, durationMinutes, analytics) => {
    completeWorkout(weekIndex, sessionIndex, exerciseCount, durationMinutes, analytics);
    saveAnalyticsEvent({ type: 'workout_complete', weekIndex, sessionIndex, durationMinutes, ...analytics });
    setActiveWorkout(null);
  }, [completeWorkout]);

  const handleExitWorkout = useCallback(() => {
    setActiveWorkout(null);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-2xl" style={{ color: 'var(--accent)', fontFamily: 'Bebas Neue' }}>KALDR</div>
      </div>
    );
  }

  // Show onboarding if no profile
  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Active workout flow
  if (activeWorkout && program) {
    const week = program.weeks[activeWorkout.weekIndex];
    const session = week?.sessions[activeWorkout.sessionIndex];
    if (session) {
      return (
        <ActiveWorkout
          session={session}
          weekIndex={activeWorkout.weekIndex}
          sessionIndex={activeWorkout.sessionIndex}
          onComplete={handleWorkoutComplete}
          onExit={handleExitWorkout}
          profile={profile}
        />
      );
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {activeTab === 'home' && (
        <HomeScreen
          profile={profile}
          program={program}
          workoutState={workoutState}
          isWorkoutCompleted={isWorkoutCompleted}
          getCurrentWeekAndSession={getCurrentWeekAndSession}
          onStartWorkout={handleStartWorkout}
        />
      )}
      {activeTab === 'program' && (
        <ProgramScreen
          program={program}
          isWorkoutCompleted={isWorkoutCompleted}
          onStartWorkout={handleStartWorkout}
        />
      )}
      {activeTab === 'progress' && (
        <ProgressScreen workoutState={workoutState} />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
