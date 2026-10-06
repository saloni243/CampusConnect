import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Calendar, Bell, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../api';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

import ConfirmModal from '../../components/common/ConfirmModal';

export const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getAllAnnouncements();
      if (res.success && Array.isArray(res.announcements)) {
        setAnnouncements(res.announcements);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      const res = await adminApi.createAnnouncement({
        title: title.trim(),
        message: message.trim(),
      });
      if (res.success) {
        setShowCreateModal(false);
        setTitle('');
        setMessage('');
        setSuccessInfo(
          `Announcement broadcasted successfully to all enrolled students! (${res.notificationsSent || 0} notifications sent)`
        );
        setTimeout(() => setSuccessInfo(''), 5000);
        fetchAnnouncements();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to broadcast announcement');
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      await adminApi.deleteAnnouncement(deleteTargetId);
      setAnnouncements((prev) => prev.filter((a) => a._id !== deleteTargetId));
      setSuccessInfo('Announcement deleted successfully.');
      setTimeout(() => setSuccessInfo(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete announcement');
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading announcements..." className="py-20" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnnouncements} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Announcements</h1>
          <p className="text-sm text-slate-500">
            Publish broadcast notices that automatically alert all registered students
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {successInfo && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}

      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements published"
          description="Send important placement drive notices, test schedules, or interview guidelines to students."
          actionLabel="Create Announcement"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                    <Bell className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-base text-slate-900">{ann.title}</h3>
                </div>

                <p className="text-sm text-slate-600 whitespace-pre-line pl-8">
                  {ann.message}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pl-8 pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(ann.createdAt)}
                  </span>
                  <span>Published by: {ann.createdBy?.name || 'TPO Office'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDeleteTargetId(ann._id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Announcement"
        message="Are you sure you want to permanently delete this broadcast announcement? It will be removed from the system."
        confirmText="Delete Announcement"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteAnnouncement}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Modal: Create Announcement */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Broadcast New Announcement</h2>
              <p className="text-xs text-slate-500 mt-1">
                This notice will be sent to the notification inbox of every registered student.
              </p>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS CodeVita Round 2 Instructions"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed guidelines, links, dress code, venue, and reporting times..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
