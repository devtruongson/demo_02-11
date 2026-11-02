import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Compass, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function TopicEditorModal({
  isOpen,
  topic,
  onClose,
  onSave,
  authToken
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    img: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (topic) {
      setFormData({
        title: topic.title || '',
        description: topic.description || '',
        img: topic.img || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        img: ''
      });
    }
    setErrorMsg('');
  }, [topic, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn tệp định dạng ảnh (JPG, PNG, WebP).');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setUploading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/upload/single', {
        method: 'POST',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        body: uploadFormData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi tải ảnh lên');
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, img: data.url }));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Vui lòng nhập tên chủ đề học tập.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      await onSave(formData, topic?.id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi lưu chủ đề');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-navy text-white flex items-center justify-center font-bold">
              <Compass className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {topic ? `Chỉnh Sửa / Đổi Tên Chủ Đề #${topic.id}` : 'Thêm Chủ Đề Học Tập Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Cập nhật tiêu đề, mô tả và ảnh bìa đại diện cho chủ đề.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Tên chủ đề học tập <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Văn minh Đông Nam Á thời cổ – trung đại"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Mô tả tóm tắt nội dung
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả ngắn gọn về phạm vi kiến thức của chủ đề trong chương trình Lịch sử 10..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy leading-relaxed resize-y"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Ảnh bìa đại diện chủ đề
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Đang tải...' : 'Tải ảnh từ máy'}</span>
              </button>

              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  placeholder="Hoặc dán URL ảnh (https://...)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>

            {/* Live Preview */}
            {formData.img && (
              <div className="relative h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mt-2">
                <img
                  src={formData.img}
                  alt="Topic Cover Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold truncate">
                    {formData.title || 'Xem trước ảnh bìa chủ đề'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{topic ? 'Lưu thay đổi' : 'Tạo chủ đề'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

