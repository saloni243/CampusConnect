import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, refreshNotifications } = useNotifications();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Announcement':
        return 'bg-purple-100 text-purple-700';
      case 'Application':
        return 'bg-blue-100 text-blue-700';
      case 'Job':
      default:
        return 'bg-emerald-100 text-emerald-700';
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    const unread = notifications.filter((n) => !n.isRead);
    for (const item of unread) {
      await markAsRead(item._id);
    }
    refreshNotifications();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`p-3.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3 cursor-pointer ${
                    !n.isRead ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${getTypeBadgeClass(
                          n.type
                        )}`}
                      >
                        {n.type}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                  </div>

                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n._id);
                      }}
                      title="Mark as read"
                      className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-white transition-colors flex-shrink-0"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {user?.role === 'student' && (
            <div className="px-4 pt-2 border-t border-slate-100 text-center">
              <Link
                to="/student/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
              >
                <span>View all in Notification center</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
