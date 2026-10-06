import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Routing Guards
import ProtectedRoute from './components/routing/ProtectedRoute';
import RoleRoute from './components/routing/RoleRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentJobs from './pages/student/StudentJobs';
import StudentApplications from './pages/student/StudentApplications';
import StudentSavedJobs from './pages/student/StudentSavedJobs';
import StudentProfile from './pages/student/StudentProfile';
import StudentNotifications from './pages/student/StudentNotifications';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyJobs from './pages/company/CompanyJobs';
import CompanyProfile from './pages/company/CompanyProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminAnalytics from './pages/admin/AdminAnalytics';

import { getRoleDashboard } from './utils/authUtils';

// Root redirect helper based on authenticated role
const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboard(user?.role)} replace />;
};

export const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes inside AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RootRedirect />} />

        {/* Student Routes */}
        <Route element={<RoleRoute allowedRoles={['student']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/jobs" element={<StudentJobs />} />
          <Route path="/student/applications" element={<StudentApplications />} />
          <Route path="/student/saved-jobs" element={<StudentSavedJobs />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
        </Route>

        {/* Company Routes */}
        <Route element={<RoleRoute allowedRoles={['company']} />}>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/jobs" element={<CompanyJobs />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
