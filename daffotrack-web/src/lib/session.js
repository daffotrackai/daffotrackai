const CURRENT_USER_KEY = 'daffotrack.currentUser';

export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  const rawValue = localStorage.getItem(CURRENT_USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUserId() {
  const currentUser = getCurrentUser();
  return currentUser?.userId ?? null;
}