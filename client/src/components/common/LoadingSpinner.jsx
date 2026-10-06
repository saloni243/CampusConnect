import React from 'react';
import { Loader2 } from 'lucide-react';

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingSpinner = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center p-6 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-indigo-600`} />
      {message && <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col items-center">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
