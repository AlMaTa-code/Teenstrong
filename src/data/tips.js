export const safetyTips = [
  "Always warm up 3-5 minutes before training. It helps you feel ready and powerful from the first rep. (AAP guideline)",
  "If something causes sharp pain, STOP. Listening to your body is a strength move — pain is your body's warning system.",
  "Rest days are when muscles actually repair and grow stronger. Taking rest builds lasting confidence in your body.",
  "Never hold your breath during exercises. Exhale on the effort, inhale on the release — steady breathing keeps you feeling powerful.",
  "Focus on form over everything. One perfect rep beats ten sloppy ones — and perfect form builds real confidence. (NSCA guideline)",
  "Avoid maximal lifts and powerlifting movements until you're skeletally mature. Build strength safely and feel powerful doing it. (AAP)",
  "If you feel dizzy or lightheaded, stop and rest. Listening to your body is a sign of strength, not weakness.",
  "Muscle burn during a set is normal and means you're getting stronger. Sharp or shooting pain is NOT — stop immediately.",
];

export const hydrationTips = [
  "Drink water before, during, and after your workout. Staying hydrated keeps your energy up so you feel powerful through every set.",
  "Aim for a glass of water 30 minutes before your session and sip between exercises. Good hydration means better posture and energy.",
  "If your pee is dark yellow, you need more water. Clear or light yellow = you're hydrated and ready to build confidence.",
  "Sports drinks aren't needed for sessions under 60 minutes. Water is perfect — keep it simple and feel great.",
];

export const scienceTips = [
  "At your age, strength gains come mostly from your brain getting better at activating muscles. That's called neuromuscular adaptation — and it's building real confidence in your body.",
  "Research shows teens who strength train have stronger bones, better posture, and more confidence — plus lower injury rates in sport.",
  "The AAP confirms that properly supervised resistance training doesn't harm growth plates or stunt growth. That's a myth — you're getting stronger for sports and life.",
  "Studies show 2-3 sessions per week is the sweet spot for teen strength gains. Consistency builds confidence and real results.",
  "Your body produces the most growth hormone during deep sleep. 8-10 hours is literally part of your training program — rest fuels your energy and posture.",
  "The NSCA found injury rates in supervised youth strength training are lower than almost every team sport. You're building strength the safe way.",
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
