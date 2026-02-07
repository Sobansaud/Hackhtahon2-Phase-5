// Auth utility functions for token management and user state

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Set token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Remove token from localStorage
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && !isTokenExpired(token);
};

// Get user ID from token
export const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.sub || null;
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
};

// Get token expiration time
export const getTokenExpiration = (): number | null => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch (error) {
    console.error('Error extracting token expiration:', error);
    return null;
  }
};

// Check if token will expire soon (within 5 minutes)
export const isTokenExpiringSoon = (): boolean => {
  const expiration = getTokenExpiration();
  if (!expiration) {
    return true; // If we can't get expiration, assume it's expiring
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60; // 5 minutes in seconds
  return expiration - currentTime < fiveMinutes;
};

// Refresh token (placeholder - implement with your backend refresh logic)
export const refreshToken = async (): Promise<boolean> => {
  // This would typically make a request to your backend to refresh the token
  // For now, returning false to indicate refresh failed
  console.warn('Token refresh not implemented - redirecting to login');
  removeToken();
  window.location.href = '/auth/sign-in';
  return false;
};

// Redirect to login if not authenticated
export const requireAuth = (currentPath: string = ''): void => {
  if (!isAuthenticated()) {
    // Store the current path for redirect after login
    if (currentPath && currentPath !== '/') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    window.location.href = '/auth/sign-in';
  }
};

// Redirect to dashboard after successful authentication
export const redirectToDashboard = (): void => {
  // Check if there's a stored redirect path
  const redirectPath = sessionStorage.getItem('redirectAfterLogin');
  if (redirectPath) {
    sessionStorage.removeItem('redirectAfterLogin');
    window.location.href = redirectPath;
  } else {
    window.location.href = '/dashboard';
  }
};
