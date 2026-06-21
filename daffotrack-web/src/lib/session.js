const CURRENT_USER_KEY = 'daffotrack.currentUser';
const CURRENT_USER_EVENT = 'daffotrack.currentUserChanged';

function notifyCurrentUserChanged(user) {
  window.dispatchEvent(new CustomEvent(CURRENT_USER_EVENT, { detail: user }));
}

export function normalizeCurrentUser(user) {
  if (!user) return null;

  const normalizedUser = { ...user };
  if (!normalizedUser.fullName && normalizedUser.studentName) {
    normalizedUser.fullName = normalizedUser.studentName;
  }

  return normalizedUser;
}

export function setCurrentUser(user) {
  const normalizedUser = normalizeCurrentUser(user);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizedUser));
  notifyCurrentUserChanged(normalizedUser);
}

export function getCurrentUser() {
  const rawValue = localStorage.getItem(CURRENT_USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return normalizeCurrentUser(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  notifyCurrentUserChanged(null);
}

export function getCurrentUserId() {
  const currentUser = getCurrentUser();
  return currentUser?.userId ?? null;
}

export function hasCurrentUserSession(user = getCurrentUser()) {
  return Boolean(
    user?.userId ||
    user?.email ||
    user?.studentId ||
    user?.fullName ||
    user?.studentName
  );
}

export function subscribeCurrentUser(listener) {
  const handleChange = (event) => {
    listener(event.detail ?? getCurrentUser());
  };

  listener(getCurrentUser());
  window.addEventListener(CURRENT_USER_EVENT, handleChange);
  window.addEventListener('storage', handleChange);

  return () => {
    window.removeEventListener(CURRENT_USER_EVENT, handleChange);
    window.removeEventListener('storage', handleChange);
  };
}
