export const safetyTips = [
  "Always warm up 3-5 minutes before training. Cold muscles are more injury-prone. (AAP guideline)",
  "If something causes sharp pain, STOP. Effort is fine — pain is your body's warning system.",
  "Rest days are when muscles actually repair and grow stronger. Skipping rest = slower progress.",
  "Never hold your breath during exercises. Exhale on the effort, inhale on the release.",
  "Focus on form over everything. One perfect rep beats ten sloppy ones. (NSCA guideline)",
  "Avoid maximal lifts and powerlifting movements until you're skeletally mature. (AAP)",
  "If you feel dizzy or lightheaded, stop and rest. That's smart, not weak.",
  "Muscle burn during a set is normal. Sharp or shooting pain is NOT — stop immediately.",
];

export const hydrationTips = [
  "Drink water before, during, and after your workout. Even mild dehydration tanks performance.",
  "Aim for a glass of water 30 minutes before your session and sip between exercises.",
  "If your pee is dark yellow, you need more water. Clear or light yellow = you're good.",
  "Sports drinks aren't needed for sessions under 60 minutes. Water is perfect.",
];

export const scienceTips = [
  "At your age, strength gains come mostly from your brain getting better at activating muscles — not from muscles growing bigger. That's called neuromuscular adaptation.",
  "Research shows teens who strength train have stronger bones, better posture, and lower injury rates in sport.",
  "The AAP confirms that properly supervised resistance training doesn't harm growth plates or stunt growth. That's a myth.",
  "Studies show 2-3 sessions per week on non-consecutive days is the sweet spot for teen strength gains.",
  "Your body produces the most growth hormone during deep sleep. 8-10 hours is literally part of your training program.",
  "The NSCA found injury rates in supervised youth strength training are lower than almost every team sport.",
];

export function getTipOfTheDay() {
  const allTips = [
    ...safetyTips.map(t => ({ text: t, type: 'safety' })),
    ...hydrationTips.map(t => ({ text: t, type: 'hydration' })),
    ...scienceTips.map(t => ({ text: t, type: 'science' })),
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return allTips[dayOfYear % allTips.length];
}
