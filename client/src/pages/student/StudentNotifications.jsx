import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Briefcase,
  Megaphone,
  FileCheck,
  Info,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export const StudentNotifications = () => {
  const { notifications, unreadCount, markAsRead, refreshNotifications, isLoading } =
    useNotifications();
  const [activeFilter, setActiveFilter] = useState('All');

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Announcement':
        return <Megaphone className="w-4 h-4 text-purple-600" />;
      case 'Application':
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'Job':
      default:
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
    }
  };

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

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const item of unread) {
      await markAsRead(item._id);
    }
    refreshNotifications();
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.isRead;
    if (activeFilter === 'Application') return n.type === 'Application';
    if (activeFilter === 'Announcement') return n.type === 'Announcement';
    return true;
  });

  if (isLoading && notifications.length === 0) {
    return <LoadingSpinner message="Loading notifications..." className="py-20" />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">
            Real-time alerts on your applications, drive updates, and announcements
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm flex items-center gap-1 overflow-x-auto">
        {['All', 'Unread', 'Application', 'Announcement'].map((tab) => {
          const count =
            tab === 'All'
              ? notifications.length
              : tab === 'Unread'
              ? unreadCount
              : notifications.filter((n) => n.type === tab).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeFilter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFilter === tab ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={
            activeFilter === 'Unread'
              ? 'You have read all your notifications!'
              : 'You have no alerts at this time.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-sm transition-all flex items-start justify-between gap-4 ${
                !n.isRead
                  ? 'border-indigo-200 bg-indigo-50/20'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !n.isRead ? 'bg-indigo-100' : 'bg-slate-100'
                  }`}
                >
                  {getTypeIcon(n.type)}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getTypeBadgeClass(
                        n.type
                      )}`}
                    >
                      {n.type}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(n.createdAt)}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" title="Unread" />
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              </div>

              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => markAsRead(n._id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1 flex-shrink-0 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
