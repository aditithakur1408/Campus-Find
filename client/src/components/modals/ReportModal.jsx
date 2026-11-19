import React, { useState } from 'react';
import { X, Upload, Shield, AlertTriangle, Pin } from 'lucide-react';
import api from '../../services/api';

export default function ReportModal({ isOpen, onClose, categories, locations, onItemCreated }) {
  const [itemType, setItemType] = useState('LOST');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [brandColor, setBrandColor] = useState('');
  const [custodyType, setCustodyType] = useState('WITH_FINDER');
  const [custodyDetails, setCustodyDetails] = useState('');
  const [proofQuestion, setProofQuestion] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!categoryId || !locationId) {
      setError('Please select both a Category and a Campus Location.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('itemType', itemType);
      data.append('title', title);
      data.append('categoryId', categoryId);
      data.append('locationId', locationId);
      data.append('incidentDate', incidentDate);
      data.append('description', description);
      if (brandColor) data.append('brandColor', brandColor);
      if (itemType === 'FOUND') {
        data.append('custodyType', custodyType);
        if (custodyDetails) data.append('custodyDetails', custodyDetails);
        if (proofQuestion) data.append('proofQuestion', proofQuestion);
      }

      files.forEach((file) => {
        data.append('images', file);
      });

      const res = await api.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        onItemCreated(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181b]/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-xl w-full border-2 border-[#18181b] shadow-[6px_6px_0_#18181b] overflow-hidden my-8">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-6 pb-3 border-b border-dashed border-[#18181b]/20 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#18181b]">Post a Campus Notice</h2>
            <p className="font-type text-[11px] text-[#b91c1c] uppercase tracking-wider font-bold">
              [ENTER ACCURATE NOTICE DETAILS]
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border-2 border-[#18181b] bg-white hover:bg-[#f1ede4] transition-colors"
          >
            <X className="w-4 h-4 text-[#18181b]" />
          </button>
        </div>

        {/* Item Type Switcher */}
        <div className="p-6 pb-2">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f1ede4] rounded-xl border-2 border-[#18181b]">
            <button
              type="button"
              onClick={() => setItemType('LOST')}
              className={`py-2 rounded-lg font-sans font-bold text-sm border-2 transition-all ${
                itemType === 'LOST'
                  ? 'bg-[#fee2e2] text-[#991b1b] border-[#18181b] shadow-[2px_2px_0_#18181b]'
                  : 'bg-transparent text-[#71717a] border-transparent hover:text-[#18181b]'
              }`}
            >
              I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setItemType('FOUND')}
              className={`py-2 rounded-lg font-sans font-bold text-sm border-2 transition-all ${
                itemType === 'FOUND'
                  ? 'bg-[#dcfce7] text-[#166534] border-[#18181b] shadow-[2px_2px_0_#18181b]'
                  : 'bg-transparent text-[#71717a] border-transparent hover:text-[#18181b]'
              }`}
            >
              I Found Something
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 p-3 rounded-xl bg-[#fee2e2] border-2 border-[#18181b] text-sm text-[#991b1b] flex items-center gap-2 font-sans font-medium">
            <AlertTriangle className="w-4 h-4 text-[#b91c1c] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 pt-2">
          {/* Title */}
          <div>
            <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Notice Title *</label>
            <input
              type="text"
              required
              placeholder={itemType === 'LOST' ? 'e.g. Blue Dell Laptop Charger' : 'e.g. Set of 3 Keys with Keychain'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Campus Spot *</label>
              <select
                required
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.buildingName} - {loc.zoneFloor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">
                Date {itemType === 'LOST' ? 'Lost' : 'Found'} *
              </label>
              <input
                type="date"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
              />
            </div>

            <div>
              <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Brand / Color</label>
              <input
                type="text"
                placeholder="e.g. Navy Blue / HP"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Description *</label>
            <textarea
              required
              rows={3}
              placeholder={itemType === 'LOST' ? 'Describe where you might have left it...' : 'Describe the general item without giving away secret marks...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b] shadow-[2px_2px_0_#18181b]"
            />
          </div>

          {/* Found Item Special Features: Anti-Fraud Verification Question */}
          {itemType === 'FOUND' && (
            <div className="p-4 rounded-xl bg-[#fef3c7] border-2 border-[#18181b] space-y-3 shadow-[3px_3px_0_#18181b]">
              <div className="flex items-center gap-2 text-[#92400e] font-sans font-bold text-sm">
                <Shield className="w-4 h-4 text-[#b45309]" />
                <span>Anti-Fraud & Custody Protection</span>
              </div>

              <div>
                <label className="block font-type text-xs text-[#52525b] uppercase mb-1">Current Physical Custody</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustodyType('WITH_FINDER')}
                    className={`py-1.5 px-3 rounded-lg border-2 border-[#18181b] font-sans font-semibold text-xs ${
                      custodyType === 'WITH_FINDER'
                        ? 'bg-[#18181b] text-white shadow-[2px_2px_0_#18181b]'
                        : 'bg-white text-[#18181b]'
                    }`}
                  >
                    I have it with me
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustodyType('AT_SECURITY_DESK')}
                    className={`py-1.5 px-3 rounded-lg border-2 border-[#18181b] font-sans font-semibold text-xs ${
                      custodyType === 'AT_SECURITY_DESK'
                        ? 'bg-[#18181b] text-white shadow-[2px_2px_0_#18181b]'
                        : 'bg-white text-[#18181b]'
                    }`}
                  >
                    Deposited at Security Desk
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-sans font-semibold text-xs text-[#92400e] mb-1">
                  Secret Proof Question (Only true owner knows):
                </label>
                <input
                  type="text"
                  placeholder="e.g. What sticker is on the back? What lockscreen photo is set?"
                  value={proofQuestion}
                  onChange={(e) => setProofQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border-2 border-[#18181b] bg-white text-[#18181b]"
                />
              </div>
            </div>
          )}

          {/* Photo Upload Box */}
          <div>
            <label className="block font-type text-xs text-[#52525b] uppercase tracking-wider mb-1 font-semibold">Pin a Photo (Optional)</label>
            <div className="border-2 border-dashed border-[#18181b] rounded-xl p-4 text-center cursor-pointer bg-[#f8f6f0] hover:bg-[#f1ede4] transition-colors shadow-[2px_2px_0_#18181b]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-9 h-9 rounded-lg border-2 border-[#18181b] bg-white flex items-center justify-center mb-1">
                  <Upload className="w-4 h-4 text-[#18181b]" />
                </div>
                <span className="font-sans font-bold text-sm text-[#18181b]">Upload Photo Attachment</span>
                <span className="font-type text-[10px] text-[#71717a] uppercase">JPEG, PNG, WebP up to 5MB</span>
              </label>
              {files.length > 0 && (
                <div className="mt-2 font-sans font-bold text-xs text-[#166534]">
                  ✓ {files.length} photo(s) selected
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="sketch-button w-full text-base !py-3"
            >
              {loading ? 'Posting Notice...' : `Post ${itemType === 'LOST' ? 'Lost' : 'Found'} Notice to Board`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
