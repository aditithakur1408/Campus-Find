import React, { useState, useEffect } from 'react';
import { X, Activity, Clock, RefreshCw, BookOpen } from 'lucide-react';
import api from '../../services/api';

export default function ActivityModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/meta/activity');
      if (res.data?.data) {
        setLogs(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch activity logs:', e);
    } finally {
      setLoading(false);
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
      second: '2-digit',
    });
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'USER_LOGIN':
        return <span className="stamp-badge bg-[#dcfce7] text-[#166534] border-[#4ade80]">LOGGED IN</span>;
      case 'USER_REGISTER':
        return <span className="stamp-badge bg-[#e0e7ff] text-[#3730a3] border-[#818cf8]">REGISTERED</span>;
      case 'ITEM_HANDOVER_VERIFIED':
        return <span className="stamp-badge bg-[#fef3c7] text-[#92400e] border-[#fbbf24]">HANDOVER VERIFIED</span>;
      default:
        return <span className="stamp-badge bg-[#f1ede4] text-[#18181b] border-[#18181b]">{action}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181b]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border-2 border-[#18181b] shadow-[6px_6px_0_#18181b] overflow-hidden max-h-[85vh] flex flex-col">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-6 pb-3 border-b border-dashed border-[#18181b]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border-2 border-[#18181b] bg-[#fef3c7] flex items-center justify-center shadow-[2px_2px_0_#18181b]">
              <BookOpen className="w-4 h-4 text-[#18181b]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-[#18181b]">Campus Registry Logbook</h2>
              <p className="font-type text-[11px] text-[#b91c1c] uppercase tracking-wider font-bold">
                [LIVE AUDIT TRAIL OF LOGINS & VERIFICATIONS]
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              title="Refresh Logs"
              className="p-1 rounded-lg border-2 border-[#18181b] bg-white hover:bg-[#f1ede4] transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#18181b]" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg border-2 border-[#18181b] bg-white hover:bg-[#f1ede4] transition-colors"
            >
              <X className="w-4 h-4 text-[#18181b]" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2.5">
          {loading ? (
            <div className="py-16 text-center font-sans font-semibold text-sm text-[#71717a]">
              <div className="w-6 h-6 border-2 border-[#18181b] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Reading registry entries...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center font-sans text-sm text-[#71717a] italic">
              No registry activity recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border-2 border-[#18181b] bg-white hover:bg-[#f8f6f0] transition-colors flex items-center justify-between gap-3 shadow-[2px_2px_0_#18181b]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border-2 border-[#18181b] bg-[#18181b] text-white flex items-center justify-center font-display font-bold text-xs shrink-0">
                    {log.user?.fullName ? log.user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-[#18181b] leading-none">
                        {log.user?.fullName || 'Unknown Student'}
                      </span>
                      <span className="font-type text-[10px] bg-[#f8f6f0] px-1.5 py-0.5 rounded border border-[#18181b]/30">
                        {log.user?.role}
                      </span>
                    </div>
                    <p className="font-type text-xs text-[#71717a] mt-0.5">
                      {log.user?.email}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  {getActionBadge(log.action)}
                  <span className="font-type text-[10px] text-[#71717a] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(log.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t-2 border-[#18181b] bg-[#f8f6f0] font-type text-xs text-[#71717a] flex items-center justify-between">
          <span>ENTRIES: <strong>{logs.length}</strong></span>
          <span className="text-[#b91c1c] font-bold">[AUDITED IN POSTGRESQL]</span>
        </div>
      </div>
    </div>
  );
}
