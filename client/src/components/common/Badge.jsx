import React from 'react';
import { APPLICATION_STATUS_CONFIG } from '../../utils/constants';

export const Badge = ({
  status,
  label,
  variant = 'default',
  className = '',
}) => {
  // If a known application status is passed, use its preset style
  if (status && APPLICATION_STATUS_CONFIG[status]) {
    const config = APPLICATION_STATUS_CONFIG[status];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        {config.label}
      </span>
    );
  }

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {label || status}
    </span>
  );
};

export default Badge;
