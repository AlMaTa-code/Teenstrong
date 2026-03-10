import exercises from './exercises';

// Compute fitness score from assessment (1.0 - 4.0)
function getFitnessScore(assessment) {
  if (!assessment) return 2;
  const vals = [assessment.pushups, assessment.squats, assessment.situps, assessment.plank].filter(Boolean);
  if (vals.length === 0) return 2;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// Suggest dumbbell weight based on bodyweight and exercise type
export function getWeightSuggestion(weightKg, exerciseId, weightUnit) {
  if (!weightKg || weightKg <= 0) return null;
  const exercise = exercises[exerciseId];
  if (!exercise || !exercise.isDumbbell) return null;

  // AAP-safe starting points for teen beginners
  const isLower = exercise.muscle?.includes('LEGS') || exercise.muscle?.includes('GLUTES');
  const pct = isLower ? 0.2 : 0.12; // 20% BW for lower, 12% for upper (per hand)
  const suggestionKg = Math.round(weightKg * pct * 2) / 2; // round to nearest 0.5kg
  const clamped = Math.max(2, Math.min(suggestionKg, 15)); // 2-15kg safe range for teens

  if (weightUnit === 'lbs') {
    return `~${Math.round(clamped * 2.205)} lbs per hand`;
  }
  return `~${clamped} kg per hand`;
}

export function buildProgram(profile) {
  const { ageGroup, experience, equipment, assessment } = profile;

  const hasBands = equipment === 'bands' || equipment === 'both';
  const hasDumbbells = equipment === 'dumbbells' || equipment === 'both';

  // Weeks 1-2: Always bodyweight (AAP requirement — learn movements unloaded)
  const w1Upper = ["warmup_jog", "warmup_circles", "incline_pushup", "prone_y_raise", "plank", "dead_bug", "cooldown_stretch"];
  const w1Lower = ["warmup_jog", "warmup_leg_swings", "squat", "lunge", "glute_bridge", "wall_sit", "calf_raise", "cooldown_stretch"];
  const w1Full = ["warmup_jog", "warmup_high_knees", "incline_pushup", "squat", "plank", "lunge", "glute_bridge", "bird_dog", "cooldown_stretch"];

  const w2Upper = ["warmup_jog", "warmup_circles", "pushup", "prone_y_raise", "plank", "dead_bug", "bird_dog", "cooldown_stretch"];
  const w2Lower = ["warmup_jog", "warmup_leg_swings", "squat", "lunge", "glute_bridge", "wall_sit", "calf_raise", "mountain_climber", "cooldown_stretch"];
  const w2Full = ["warmup_jog", "warmup_high_knees", "pushup", "squat", "plank", "lunge", "glute_bridge", "mountain_climber", "cooldown_stretch"];

  // Weeks 3-4: Equipment-dependent
  let w3eq = "Bodyweight";
  let w3Upper, w3Lower, w3Full;
  let w4Upper, w4Lower, w4Full;

  if (hasBands && hasDumbbells) {
    w3eq = "Bands + Dumbbells";
    w3Upper = ["warmup_jog", "warmup_circles", "db_floor_press", "band_row", "db_shoulder_press", "db_curl", "plank", "cooldown_stretch"];
    w3Lower = ["warmup_jog", "warmup_leg_swings", "db_goblet_squat", "lunge", "db_rdl", "glute_bridge", "calf_raise", "cooldown_stretch"];
    w3Full = ["warmup_jog", "warmup_high_knees", "db_floor_press", "db_goblet_squat", "band_row", "db_lateral_raise", "plank", "mountain_climber", "cooldown_stretch"];
    w4Upper = ["warmup_jog", "warmup_circles", "db_floor_press", "band_row", "db_shoulder_press", "db_curl", "band_tricep_pushdown", "plank", "cooldown_stretch"];
    w4Lower = ["warmup_jog", "warmup_leg_swings", "db_goblet_squat", "lunge", "db_rdl", "glute_bridge", "calf_raise", "wall_sit", "cooldown_stretch"];
    w4Full = ["warmup_jog", "warmup_high_knees", "db_floor_press", "db_goblet_squat", "band_row", "db_lateral_raise", "db_curl", "plank", "mountain_climber", "cooldown_stretch"];
  } else if (hasDumbbells) {
    w3eq = "Dumbbells";
    w3Upper = ["warmup_jog", "warmup_circles", "pushup", "db_floor_press", "db_row", "db_curl", "plank", "cooldown_stretch"];
    w3Lower = ["warmup_jog", "warmup_leg_swings", "db_goblet_squat", "lunge", "db_rdl", "glute_bridge", "calf_raise", "cooldown_stretch"];
    w3Full = ["warmup_jog", "warmup_high_knees", "db_floor_press", "db_goblet_squat", "db_row", "db_shoulder_press", "plank", "cooldown_stretch"];
    w4Upper = ["warmup_jog", "warmup_circles", "pushup", "db_floor_press", "db_row", "db_shoulder_press", "db_curl", "plank", "cooldown_stretch"];
    w4Lower = ["warmup_jog", "warmup_leg_swings", "db_goblet_squat", "lunge", "db_rdl", "glute_bridge", "calf_raise", "wall_sit", "cooldown_stretch"];
    w4Full = ["warmup_jog", "warmup_high_knees", "db_floor_press", "db_goblet_squat", "db_row", "db_lateral_raise", "db_curl", "plank", "cooldown_stretch"];
  } else if (hasBands) {
    w3eq = "Resistance Band";
    w3Upper = ["warmup_jog", "warmup_circles", "pushup", "band_row", "band_press", "band_curl", "band_tricep_pushdown", "plank", "cooldown_stretch"];
    w3Lower = ["warmup_jog", "warmup_leg_swings", "band_squat", "lunge", "glute_bridge", "wall_sit", "calf_raise", "cooldown_stretch"];
    w3Full = ["warmup_jog", "warmup_high_knees", "band_press", "band_squat", "band_row", "band_shoulder_press", "plank", "mountain_climber", "cooldown_stretch"];
    w4Upper = ["warmup_jog", "warmup_circles", "pushup", "band_row", "band_press", "band_curl", "band_tricep_pushdown", "plank", "dead_bug", "cooldown_stretch"];
    w4Lower = ["warmup_jog", "warmup_leg_swings", "band_squat", "lunge", "glute_bridge", "wall_sit", "calf_raise", "mountain_climber", "cooldown_stretch"];
    w4Full = ["warmup_jog", "warmup_high_knees", "band_press", "band_squat", "band_row", "band_shoulder_press", "band_curl", "plank", "mountain_climber", "cooldown_stretch"];
  } else {
    w3eq = "Bodyweight";
    w3Upper = ["warmup_jog", "warmup_circles", "pushup", "bench_pushup", "prone_y_raise", "plank", "bird_dog", "mountain_climber", "dead_bug", "cooldown_stretch"];
    w3Lower = ["warmup_jog", "warmup_leg_swings", "squat", "lunge", "glute_bridge", "wall_sit", "calf_raise", "dead_bug", "bird_dog", "cooldown_stretch"];
    w3Full = ["warmup_jog", "warmup_high_knees", "pushup", "squat", "plank", "lunge", "bench_pushup", "glute_bridge", "mountain_climber", "cooldown_stretch"];
    w4Upper = ["warmup_jog", "warmup_circles", "pushup", "bench_pushup", "prone_y_raise", "plank", "bird_dog", "mountain_climber", "dead_bug", "cooldown_stretch"];
    w4Lower = ["warmup_jog", "warmup_leg_swings", "squat", "lunge", "glute_bridge", "wall_sit", "calf_raise", "dead_bug", "mountain_climber", "cooldown_stretch"];
    w4Full = ["warmup_jog", "warmup_high_knees", "pushup", "squat", "plank", "lunge", "bench_pushup", "glute_bridge", "mountain_climber", "cooldown_stretch"];
  }

  // For 12-14 age group, slightly reduce volume
  const isYounger = ageGroup === '12-14';

  const weeks = [
    {
      week: 1,
      label: "Week 1 — Learn the Basics",
      equipment: "Bodyweight",
      sessions: [
        { day: "Day 1", label: "Upper Body", exercises: w1Upper, type: "upper" },
        { day: "Day 2", label: "Lower Body", exercises: w1Lower, type: "lower" },
        { day: "Day 3", label: "Full Body", exercises: w1Full, type: "full" },
      ],
    },
    {
      week: 2,
      label: "Week 2 — Build Confidence",
      equipment: "Bodyweight",
      sessions: [
        { day: "Day 1", label: "Upper Body", exercises: w2Upper, type: "upper" },
        { day: "Day 2", label: "Lower Body", exercises: w2Lower, type: "lower" },
        { day: "Day 3", label: "Full Body", exercises: w2Full, type: "full" },
      ],
    },
    {
      week: 3,
      label: `Week 3 — Add ${w3eq}`,
      equipment: w3eq,
      sessions: [
        { day: "Day 1", label: "Upper Body", exercises: w3Upper, type: "upper" },
        { day: "Day 2", label: "Lower Body", exercises: w3Lower, type: "lower" },
        { day: "Day 3", label: "Full Body", exercises: w3Full, type: "full" },
      ],
    },
    {
      week: 4,
      label: `Week 4 — Push Further`,
      equipment: w3eq,
      sessions: [
        { day: "Day 1", label: "Upper Body", exercises: w4Upper, type: "upper" },
        { day: "Day 2", label: "Lower Body", exercises: w4Lower, type: "lower" },
        { day: "Day 3", label: "Full Body", exercises: w4Full, type: "full" },
      ],
    },
  ];

  // Determine starting week based on fitness assessment + experience
  const fitnessScore = getFitnessScore(assessment);
  let startWeek = 0;

  if (fitnessScore >= 2.5 && !isYounger) {
    startWeek = 1; // Skip basics, start at Week 2
  } else if (experience === 'regular' && !isYounger) {
    startWeek = 1;
  }

  return { weeks, startWeek, fitnessScore };
}

export function getExerciseData(exerciseId) {
  return exercises[exerciseId] || null;
}
