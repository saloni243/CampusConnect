import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileCheck,
  UserCheck,
  Building2,
  Users,
  FileText,
  Megaphone,
  Bell,
  X,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const role = user?.role;

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/jobs', label: 'Explore Jobs', icon: Briefcase },
    { to: '/student/applications', label: 'My Applications', icon: FileCheck },
    { to: '/student/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
    { to: '/student/profile', label: 'Profile & Resume', icon: UserCheck },
    { to: '/student/notifications', label: 'Notifications', icon: Bell },
  ];

  const companyLinks = [
    { to: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/company/jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/company/profile', label: 'Company Profile', icon: Building2 },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/companies', label: 'Companies', icon: Building2 },
    { to: '/admin/jobs', label: 'Jobs / Drives', icon: Briefcase },
    { to: '/admin/applications', label: 'Applications', icon: FileText },
    { to: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  ];

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return adminLinks;
      case 'company':
        return companyLinks;
      case 'student':
        return studentLinks;
      default:
        return [];
    }
  };

  const navLinks = getLinks();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200/80 bg-white pt-16 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-3 py-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pb-3 lg:hidden border-b border-slate-100 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {role === 'admin' ? 'TPO Administration' : role === 'company' ? 'Recruiter Portal' : 'Student Portal'}
            </div>

            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    {item.to === '/student/notifications' && unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-center">
            <p className="text-xs font-semibold text-slate-700">Need Assistance?</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Contact College Placement Cell</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
