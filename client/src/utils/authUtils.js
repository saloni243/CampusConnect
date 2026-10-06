/**
 * Utility functions for JWT handling and role-based navigation routing.
 */

/**
 * Checks if a JWT token is expired or malformed.
 * @param {string} token 
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  if (!token || typeof token !== 'string') return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    if (!decoded || typeof decoded.exp !== 'number') return false;
    
    // Buffer by 5 seconds to prevent edge-case race conditions
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTimeInSeconds + 5;
  } catch (error) {
    return true;
  }
};

/**
 * Returns the default dashboard URL path corresponding to a user role.
 * @param {string} role 
 * @returns {string}
 */
export const getRoleDashboard = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'company':
      return '/company/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/login';
  }
};

/**
 * Checks if a given pathname is allowed for a user role.
 * @param {string} pathname 
 * @param {string} role 
 * @returns {boolean}
 */
export const isPathAllowedForRole = (pathname, role) => {
  if (!pathname || !role) return false;
  if (role === 'admin' && pathname.startsWith('/admin')) return true;
  if (role === 'company' && pathname.startsWith('/company')) return true;
  if (role === 'student' && pathname.startsWith('/student')) return true;
  return false;
};
