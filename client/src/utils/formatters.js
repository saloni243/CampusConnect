const SERVER_BASE = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

/**
 * Resolves static media URLs (e.g., /uploads/profiles/...) to full backend URLs
 */
export const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Ensure single slash separation
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${SERVER_BASE}${cleanPath}`;
};

/**
 * Formats a date into a clean, human-readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return 'N/A';
  }
};

/**
 * Formats a salary package value in LPA (Lakhs Per Annum)
 */
export const formatPackage = (pkg) => {
  if (pkg === null || pkg === undefined || pkg === '') return 'Not specified';
  const num = Number(pkg);
  return isNaN(num) ? `${pkg} LPA` : `₹${num.toFixed(1)} LPA`;
};
