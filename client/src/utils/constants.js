export const USER_ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin',
};

export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  REJECTED: 'Rejected',
  SELECTED: 'Selected',
};

export const APPLICATION_STATUS_CONFIG = {
  [APPLICATION_STATUS.APPLIED]: {
    label: 'Applied',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  [APPLICATION_STATUS.UNDER_REVIEW]: {
    label: 'Under Review',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  [APPLICATION_STATUS.SHORTLISTED]: {
    label: 'Shortlisted',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500',
  },
  [APPLICATION_STATUS.INTERVIEW]: {
    label: 'Interview',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
  },
  [APPLICATION_STATUS.SELECTED]: {
    label: 'Selected',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
  },
};
