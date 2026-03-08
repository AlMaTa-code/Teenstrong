export function getRestDuration(exercise) {
  if (exercise?.isWarmup || exercise?.isCooldown) {
    return 30;
  }
  return 60;
}
