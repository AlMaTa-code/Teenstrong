const PROFILE_KEY = 'teenstrong_profile';
const STATE_KEY = 'teenstrong_state';

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function loadProfile() {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load profile:', e);
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function loadState() {
  try {
    const data = localStorage.getItem(STATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load state:', e);
    return null;
  }
}

export function clearAllData() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(STATE_KEY);
}
