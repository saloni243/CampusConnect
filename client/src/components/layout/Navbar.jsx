import React from 'react';
import { Menu, LogOut, GraduationCap, Building2, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            TPO Admin
          </span>
        );
      case 'company':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Building2 className="w-3.5 h-3.5" />
            Company
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <GraduationCap className="w-3.5 h-3.5" />
            Student
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
              CampusConnect
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Placement Portal
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user && getRoleBadge(user.role)}

        <NotificationDropdown />

        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">
              {user?.name || 'User'}
            </span>
            <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
              {user?.email}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Log Out"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
