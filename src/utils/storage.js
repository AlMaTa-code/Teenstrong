const PROFILE_KEY = 'kaldr_profile';
const STATE_KEY = 'kaldr_state';

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
  localStorage.removeItem(ANALYTICS_KEY);
}

const ANALYTICS_KEY = 'kaldr_analytics';

export function saveAnalyticsEvent(event) {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    const events = data ? JSON.parse(data) : [];
    events.push({ ...event, timestamp: new Date().toISOString() });
    // Keep last 500 events to avoid storage bloat
    const trimmed = events.length > 500 ? events.slice(-500) : events;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save analytics:', e);
  }
}

export function loadAnalytics() {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load analytics:', e);
    return [];
  }
}
