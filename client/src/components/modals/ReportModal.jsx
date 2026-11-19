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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191712]/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-[#fbf6e6] rounded-[255px_14px_225px_16px/16px_225px_14px_255px] max-w-xl w-full border-[2.5px] border-[#191712] shadow-[6px_8px_0_#191712] overflow-hidden my-8">
        {/* Masking Tape */}
        <div className="tape-sticker" />

        {/* Header */}
        <div className="px-6 pt-7 pb-3 border-b-2 border-dashed border-[#191712]/30 flex items-center justify-between">
          <div>
            <h2 className="font-hand font-bold text-3xl text-[#191712]">Pin a New Campus Notice</h2>
            <p className="font-type text-[11px] text-[#d9584d] uppercase tracking-wider">
              [ENTER ACCURATE NOTICE DETAILS]
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border-2 border-[#191712] bg-[#f2ead4] hover:bg-[#ffe45e] transition-colors"
          >
            <X className="w-5 h-5 text-[#191712]" />
          </button>
        </div>

        {/* Item Type Switcher */}
        <div className="p-6 pb-2">
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#f2ead4] rounded-2xl border-2 border-[#191712]">
            <button
              type="button"
              onClick={() => setItemType('LOST')}
              className={`py-2 rounded-xl font-hand font-bold text-2xl border-2 border-[#191712] transition-all ${
                itemType === 'LOST'
                  ? 'bg-[#ffc9dc] text-[#d9584d] shadow-[3px_3px_0_#191712]'
                  : 'bg-transparent text-[#5d5744] border-transparent hover:text-[#191712]'
              }`}
            >
              I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setItemType('FOUND')}
              className={`py-2 rounded-xl font-hand font-bold text-2xl border-2 border-[#191712] transition-all ${
                itemType === 'FOUND'
                  ? 'bg-[#b8ecd0] text-[#191712] shadow-[3px_3px_0_#191712]'
                  : 'bg-transparent text-[#5d5744] border-transparent hover:text-[#191712]'
              }`}
            >
              I Found Something
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 p-3 rounded-xl bg-[#ffc9dc] border-2 border-[#191712] text-sm text-[#191712] flex items-center gap-2 font-neat">
            <AlertTriangle className="w-5 h-5 text-[#d9584d] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 pt-2">
          {/* Title */}
          <div>
            <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1">Notice Title *</label>
            <input
              type="text"
              required
              placeholder={itemType === 'LOST' ? 'e.g. Blue Dell Laptop Charger' : 'e.g. Set of 3 Keys with Ferrari Keychain'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-lg rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-base rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1">Campus Spot *</label>
              <select
                required
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3 py-2 text-base rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
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
              <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1">
                Date {itemType === 'LOST' ? 'Lost' : 'Found'} *
              </label>
              <input
                type="date"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-3 py-2 text-base rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
              />
            </div>

            <div>
              <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1">Brand / Color</label>
              <input
                type="text"
                placeholder="e.g. Navy Blue / HP"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-full px-3 py-2 text-lg rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1">Description *</label>
            <textarea
              required
              rows={3}
              placeholder={itemType === 'LOST' ? 'Describe where you might have left it...' : 'Describe the general item without giving away secret marks...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-lg rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712] shadow-[2px_2px_0_#191712]"
            />
          </div>

          {/* Found Item Special Features: Anti-Fraud Verification Question */}
          {itemType === 'FOUND' && (
            <div className="p-4 rounded-2xl bg-[#ffe45e]/50 border-2 border-[#191712] space-y-3 shadow-[3px_3px_0_#191712]">
              <div className="flex items-center gap-2 text-[#191712] font-hand font-bold text-xl">
                <Shield className="w-5 h-5 text-[#d9584d]" />
                <span>Anti-Fraud & Custody Protection</span>
              </div>

              <div>
                <label className="block font-type text-xs text-[#5d5744] uppercase mb-1">Current Physical Custody</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustodyType('WITH_FINDER')}
                    className={`py-1.5 px-3 rounded-xl border-2 border-[#191712] font-hand font-bold text-lg ${
                      custodyType === 'WITH_FINDER'
                        ? 'bg-[#ffe45e] shadow-[2px_2px_0_#191712]'
                        : 'bg-[#fbf6e6] text-[#5d5744]'
                    }`}
                  >
                    I have it with me
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustodyType('AT_SECURITY_DESK')}
                    className={`py-1.5 px-3 rounded-xl border-2 border-[#191712] font-hand font-bold text-lg ${
                      custodyType === 'AT_SECURITY_DESK'
                        ? 'bg-[#ffe45e] shadow-[2px_2px_0_#191712]'
                        : 'bg-[#fbf6e6] text-[#5d5744]'
                    }`}
                  >
                    Deposited at Security Desk
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-hand font-bold text-xl text-[#191712] mb-1">
                  Secret Proof Question (Only true owner knows):
                </label>
                <input
                  type="text"
                  placeholder="e.g. What sticker is on the back? What lockscreen photo is set?"
                  value={proofQuestion}
                  onChange={(e) => setProofQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-lg rounded-xl border-2 border-[#191712] bg-[#fbf6e6] text-[#191712]"
                />
              </div>
            </div>
          )}

          {/* Photo Upload Box (Raasta styled upload dropzone) */}
          <div>
            <label className="block font-type text-xs text-[#5d5744] uppercase tracking-wider mb-1">Pin a Photo (Optional)</label>
            <div className="border-2 border-dashed border-[#191712] rounded-2xl p-4 text-center cursor-pointer bg-[#c2e5f7] hover:bg-[#ffe45e] transition-colors shadow-[2px_3px_0_#191712]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#191712] bg-[#ffe45e] flex items-center justify-center mb-1">
                  <Upload className="w-5 h-5 text-[#191712]" />
                </div>
                <span className="font-hand font-bold text-2xl text-[#191712]">Upload Photo Attachment</span>
                <span className="font-type text-[10px] text-[#5d5744] uppercase">JPEG, PNG, WebP up to 5MB</span>
              </label>
              {files.length > 0 && (
                <div className="mt-2 font-hand font-bold text-xl text-[#2f6f46]">
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
              className="sketch-button w-full !text-2xl !py-3"
            >
              {loading ? 'Pinning Notice...' : `Pin ${itemType === 'LOST' ? 'Lost' : 'Found'} Notice to Board`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
