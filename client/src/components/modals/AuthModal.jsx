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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191712]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-[#fbf6e6] rounded-[255px_14px_225px_16px/16px_225px_14px_255px] max-w-md w-full border-[2.5px] border-[#191712] shadow-[6px_8px_0_#191712] overflow-hidden">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-7 pb-3 border-b-2 border-dashed border-[#191712]/30 flex items-center justify-between">
          <div>
            <h2 className="font-hand font-bold text-3xl text-[#191712]">
              {isRegister ? 'Student Registration' : 'Student & Staff Sign In'}
            </h2>
            <p className="font-type text-[11px] text-[#eb4d4b] uppercase tracking-wider font-bold">
              [CAMPUS CREDENTIALS REQUIRED]
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffd32a] transition-colors"
          >
            <X className="w-5 h-5 text-[#191712]" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b-2 border-[#191712] bg-[#f2ead4]">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-2 font-hand font-bold text-2xl transition-all ${
              !isRegister
                ? 'bg-[#fbf6e6] text-[#191712] border-b-2 border-[#eb4d4b]'
                : 'text-[#5d5744] hover:text-[#191712]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-2 font-hand font-bold text-2xl transition-all ${
              isRegister
                ? 'bg-[#fbf6e6] text-[#191712] border-b-2 border-[#eb4d4b]'
                : 'text-[#5d5744] hover:text-[#191712]'
            }`}
          >
            New Student Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#ff7979] border-2 border-[#191712] flex items-center gap-2 font-neat text-lg text-[#191712] shadow-[2px_2px_0_#191712]">
            <AlertCircle className="w-5 h-5 text-[#eb4d4b] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1 font-bold">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#5d5744] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajveer Singh"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xl rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1 font-bold">College Roll / Student ID</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-[#5d5744] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. 2102508787"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xl rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1 font-bold">Role Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                    className={`py-1.5 px-3 rounded-xl border-2 border-[#191712] font-hand font-bold text-xl flex items-center justify-center gap-1.5 ${
                      formData.role === 'STUDENT'
                        ? 'bg-[#ffd32a] shadow-[2px_2px_0_#191712]'
                        : 'bg-[#f2ead4] text-[#5d5744]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Student / Scholar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'SECURITY_STAFF' })}
                    className={`py-1.5 px-3 rounded-xl border-2 border-[#191712] font-hand font-bold text-xl flex items-center justify-center gap-1.5 ${
                      formData.role === 'SECURITY_STAFF'
                        ? 'bg-[#ffd32a] shadow-[2px_2px_0_#191712]'
                        : 'bg-[#f2ead4] text-[#5d5744]'
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
            <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1 font-bold">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5d5744] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="2102508787@svyasa-sas.edu.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xl rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
              />
            </div>
          </div>

          <div>
            <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1 font-bold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5d5744] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xl rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="sketch-button w-full !text-2xl !py-3"
            >
              {loading ? 'Verifying...' : isRegister ? 'Create College Account' : 'Sign In Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
