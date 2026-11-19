import React, { useState } from 'react';
import { X, Mail, Lock, User, IdCard, Shield, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    studentId: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const res = await api.post(endpoint, formData);
      if (res.data?.data) {
        login(res.data.data.user, res.data.data.token);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181b]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-md w-full border-2 border-[#18181b] shadow-[6px_6px_0_#18181b] overflow-hidden">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-6 pb-3 border-b border-dashed border-[#18181b]/20 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#18181b]">
              {isRegister ? 'Student Registration' : 'Student & Staff Sign In'}
            </h2>
            <p className="font-type text-[11px] text-[#b91c1c] uppercase tracking-wider font-bold">
              [CAMPUS CREDENTIALS REQUIRED]
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border-2 border-[#18181b] bg-white hover:bg-[#f1ede4] transition-colors"
          >
            <X className="w-4 h-4 text-[#18181b]" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b-2 border-[#18181b] bg-[#f1ede4]">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-2 font-sans font-bold text-sm transition-all ${
              !isRegister
                ? 'bg-white text-[#18181b] border-b-2 border-[#18181b]'
                : 'text-[#71717a] hover:text-[#18181b]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-2 font-sans font-bold text-sm transition-all ${
              isRegister
                ? 'bg-white text-[#18181b] border-b-2 border-[#18181b]'
                : 'text-[#71717a] hover:text-[#18181b]'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#fee2e2] border-2 border-[#18181b] flex items-center gap-2 font-sans text-sm text-[#991b1b] shadow-[2px_2px_0_#18181b]">
            <AlertCircle className="w-4 h-4 text-[#b91c1c] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajveer Singh"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">College Roll / Student ID</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. 2102508787"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Role Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                    className={`py-1.5 px-3 rounded-lg border-2 border-[#18181b] font-sans font-semibold text-xs flex items-center justify-center gap-1.5 ${
                      formData.role === 'STUDENT'
                        ? 'bg-[#18181b] text-white shadow-[2px_2px_0_#18181b]'
                        : 'bg-[#f8f6f0] text-[#71717a]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Student / Scholar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'SECURITY_STAFF' })}
                    className={`py-1.5 px-3 rounded-lg border-2 border-[#18181b] font-sans font-semibold text-xs flex items-center justify-center gap-1.5 ${
                      formData.role === 'SECURITY_STAFF'
                        ? 'bg-[#18181b] text-white shadow-[2px_2px_0_#18181b]'
                        : 'bg-[#f8f6f0] text-[#71717a]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Security Desk</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="2102508787@svyasa-sas.edu.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
              />
            </div>
          </div>

          <div>
            <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="sketch-button w-full text-base !py-2.5"
            >
              {loading ? 'Verifying...' : isRegister ? 'Create College Account' : 'Sign In Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
