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
        return <span className="stamp-badge bg-[#b8ecd0] text-[#191712]">LOGGED IN</span>;
      case 'USER_REGISTER':
        return <span className="stamp-badge bg-[#c2e5f7] text-[#191712]">REGISTERED</span>;
      case 'ITEM_HANDOVER_VERIFIED':
        return <span className="stamp-badge bg-[#ffe45e] text-[#191712]">HANDOVER VERIFIED</span>;
      default:
        return <span className="stamp-badge bg-[#f2ead4] text-[#191712]">{action}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191712]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-[#fbf6e6] rounded-[255px_14px_225px_16px/16px_225px_14px_255px] max-w-2xl w-full border-[2.5px] border-[#191712] shadow-[6px_8px_0_#191712] overflow-hidden max-h-[85vh] flex flex-col">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-7 pb-3 border-b-2 border-dashed border-[#191712]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#191712] bg-[#ffe45e] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#191712]" />
            </div>
            <div>
              <h2 className="font-hand font-bold text-3xl text-[#191712]">Campus Registry Logbook</h2>
              <p className="font-type text-[11px] text-[#d9584d] uppercase tracking-wider">
                [LIVE AUDIT TRAIL OF LOGINS & VERIFICATIONS]
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              title="Refresh Logs"
              className="p-1 rounded-lg border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffe45e] transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#191712]" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffe45e] transition-colors"
            >
              <X className="w-5 h-5 text-[#191712]" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="py-16 text-center font-hand font-bold text-2xl text-[#5d5744]">
              <div className="w-8 h-8 border-[3px] border-[#191712] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Reading registry entries...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center font-neat text-lg text-[#5d5744] italic">
              No registry activity recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffe45e]/30 transition-colors flex items-center justify-between gap-3 shadow-[2px_2px_0_#191712]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-[#191712] bg-[#ffe45e] text-[#191712] flex items-center justify-center font-hand font-bold text-lg shrink-0">
                    {log.user?.fullName ? log.user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-hand font-bold text-2xl text-[#191712] leading-none">
                        {log.user?.fullName || 'Unknown Student'}
                      </span>
                      <span className="font-type text-[10px] bg-[#fbf6e6] px-2 py-0.5 rounded border border-[#191712]">
                        {log.user?.role}
                      </span>
                    </div>
                    <p className="font-type text-xs text-[#5d5744] mt-0.5">
                      {log.user?.email}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  {getActionBadge(log.action)}
                  <span className="font-type text-[10px] text-[#5d5744] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(log.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t-2 border-[#191712] bg-[#f2ead4] font-type text-xs text-[#5d5744] flex items-center justify-between">
          <span>ENTRIES: <strong>{logs.length}</strong></span>
          <span className="text-[#d9584d]">[AUDITED IN POSTGRESQL]</span>
        </div>
      </div>
    </div>
  );
}
