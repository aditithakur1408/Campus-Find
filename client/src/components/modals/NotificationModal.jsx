import React, { useState, useEffect } from 'react';
import { X, Bell, Clock, RefreshCw, CheckCheck, Key, ExternalLink } from 'lucide-react';
import api from '../../services/api';

export default function NotificationModal({ isOpen, onClose, onRefreshUnread, onOpenItemById }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/meta/notifications');
      if (res.data?.data) {
        setNotifications(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/meta/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      if (onRefreshUnread) onRefreshUnread();
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/meta/notifications/all/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (onRefreshUnread) onRefreshUnread();
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  };

  if (!isOpen) return null;

  const formatTimestamp = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191712]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-[#fbf6e6] rounded-[255px_14px_225px_16px/16px_225px_14px_255px] max-w-2xl w-full border-[2.5px] border-[#191712] shadow-[6px_8px_0_#191712] overflow-hidden max-h-[85vh] flex flex-col">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-7 pb-3 border-b-2 border-dashed border-[#191712]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#191712] bg-[#ffe45e] flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-[#191712]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#d9584d] border border-[#191712]" />
              )}
            </div>
            <div>
              <h2 className="font-hand font-bold text-3xl text-[#191712]">Campus Notice Inbox</h2>
              <p className="font-type text-[11px] text-[#d9584d] uppercase tracking-wider">
                [HANDOVER CODES & CLAIM UPDATES]
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                title="Mark all as read"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#191712] bg-[#f2ead4] hover:bg-[#b8ecd0] font-type text-xs transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={fetchNotifications}
              title="Refresh Notifications"
              className="p-1 rounded-lg border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffe45e] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#191712]" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffe45e] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-[#191712]" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="py-16 text-center font-hand font-bold text-2xl text-[#5d5744]">
              <div className="w-8 h-8 border-[3px] border-[#191712] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Checking your mailbox...
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center font-neat text-lg text-[#5d5744] italic">
              Your inbox is clear. Updates on your claims and posted notices will appear here.
            </div>
          ) : (
            notifications.map((item) => {
              // Extract 6-digit Handover Code if present
              const otpMatch = item.message.match(/Handover Code is:\s*(\d{6})/i);
              const extractedOtp = otpMatch ? otpMatch[1] : null;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 border-[#191712] transition-colors space-y-2 shadow-[2px_2px_0_#191712] ${
                    item.isRead ? 'bg-[#fbf6e6]' : 'bg-[#fff9db] border-l-4 border-l-[#d9584d]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-hand font-bold text-2xl text-[#191712]">
                        {item.title}
                      </span>
                      {!item.isRead && (
                        <span className="stamp-badge bg-[#d9584d] text-[#fbf6e6] text-[10px] py-0.5">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="font-type text-[11px] text-[#5d5744] flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(item.createdAt)}
                    </span>
                  </div>

                  <p className="font-neat text-lg text-[#191712] leading-relaxed">
                    {item.message}
                  </p>

                  {/* Highlighted Handover PIN Box */}
                  {extractedOtp && (
                    <div className="p-3 bg-[#ffe45e] border-2 border-[#191712] rounded-xl flex items-center justify-between shadow-[2px_2px_0_#191712]">
                      <div className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-[#d9584d]" />
                        <span className="font-type text-xs text-[#191712] uppercase font-bold">
                          Handover PIN:
                        </span>
                      </div>
                      <span className="font-type font-bold text-2xl tracking-widest text-[#191712] bg-[#fbf6e6] px-3 py-1 rounded-lg border border-[#191712]">
                        {extractedOtp}
                      </span>
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <div>
                      {item.actionLink && onOpenItemById && (
                        <button
                          onClick={() => {
                            const itemId = item.actionLink.replace('/items/', '');
                            onOpenItemById(itemId);
                            onClose();
                          }}
                          className="font-hand font-bold text-base text-[#d9584d] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Notice Details</span>
                        </button>
                      )}
                    </div>

                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="font-type text-xs text-[#5d5744] hover:text-[#191712] underline cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t-2 border-[#191712] bg-[#f2ead4] font-type text-xs text-[#5d5744] flex items-center justify-between">
          <span>TOTAL: <strong>{notifications.length}</strong> ({unreadCount} UNREAD)</span>
          <span className="text-[#d9584d]">[ENCRYPTED HANDOVERS]</span>
        </div>
      </div>
    </div>
  );
}
