import React, { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff,
  Upload, Link as LinkIcon, Image as ImageIcon, CheckCircle,
  AlertCircle, RefreshCw, Sliders, ChevronLeft
} from 'lucide-react';

export default function BannerManagerModal({
  isOpen,
  onClose,
  authToken,
  onSlidesUpdated
}) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    order_index: 0,
    is_active: true
  });

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/banner-slides/all?_t=${Date.now()}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách banner:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSlides();
      setIsFormOpen(false);
      setEditingSlide(null);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      order_index: slides.length + 1,
      is_active: true
    });
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image_url: slide.image_url || '',
      link_url: slide.link_url || '',
      order_index: slide.order_index || 0,
      is_active: Boolean(slide.is_active)
    });
    setErrorMsg('');
    setIsFormOpen(true);
  };

  // Upload image to server
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
      setFormData((prev) => ({ ...prev, image_url: data.url }));
      setSuccessMsg('Tải ảnh lên máy chủ thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Toggle active/inactive
  const handleToggleActive = async (slide) => {
    try {
      const res = await fetch(`/api/banner-slides/${slide.id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        await fetchSlides();
        if (onSlidesUpdated) onSlidesUpdated();
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái: ' + err.message);
    }
  };

  // Delete slide
  const handleDelete = async (slide) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa slide "${slide.title || 'không tên'}" này không?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/banner-slides/${slide.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        await fetchSlides();
        if (onSlidesUpdated) onSlidesUpdated();
      }
    } catch (err) {
      alert('Lỗi xóa slide: ' + err.message);
    }
  };

  // Reorder slides
  const handleMoveOrder = async (slide, direction) => {
    const idx = slides.findIndex((s) => s.id === slide.id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const targetSlide = slides[targetIdx];
    const newCurrentOrder = targetSlide.order_index || targetIdx;
    const newTargetOrder = slide.order_index || idx;

    try {
      await Promise.all([
        fetch(`/api/banner-slides/${slide.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ ...slide, order_index: newCurrentOrder })
        }),
        fetch(`/api/banner-slides/${targetSlide.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ ...targetSlide, order_index: newTargetOrder })
        })
      ]);
      await fetchSlides();
      if (onSlidesUpdated) onSlidesUpdated();
    } catch (err) {
      console.error('Lỗi đổi thứ tự:', err);
    }
  };

  // Save form
  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      setErrorMsg('Vui lòng cung cấp ảnh (tải ảnh lên hoặc dán link ảnh).');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      const url = editingSlide ? `/api/banner-slides/${editingSlide.id}` : '/api/banner-slides';
      const method = editingSlide ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi lưu slide banner');
      }

      await fetchSlides();
      if (onSlidesUpdated) onSlidesUpdated();
      setIsFormOpen(false);
      setEditingSlide(null);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isFormOpen
                  ? editingSlide
                    ? 'Chỉnh Sửa Slide Banner'
                    : 'Thêm Slide Banner Mới'
                  : 'Cấu Hình Banner Trang Chủ (Carousel)'}
              </h3>
              <p className="text-xs text-slate-500">
                {isFormOpen
                  ? 'Cập nhật thông tin hình ảnh và đường dẫn cho slide'
                  : 'Quản lý hình ảnh trình chiếu tự động cho banner đầu trang'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW 1: LIST SLIDES */}
          {!isFormOpen && (
            <div className="space-y-4">
              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs text-slate-600 font-medium">
                  {slides.filter((s) => s.is_active).length > 0 ? (
                    <span>
                      Đang kích hoạt <strong>{slides.filter((s) => s.is_active).length}</strong> / {slides.length} slide. (Trình chiếu dạng Carousel với lớp phủ tối chuẩn học thuật).
                    </span>
                  ) : (
                    <span className="text-amber-800">
                      ⚠️ Chưa có ảnh nào được kích hoạt. Banner sẽ hiển thị màu nền mặc định <code>#162238</code>.
                    </span>
                  )}
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm slide banner</span>
                </button>
              </div>

              {/* Loading */}
              {loading && (
                <div className="p-8 text-center text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang tải danh sách banner...</span>
                </div>
              )}

              {/* Empty state */}
              {!loading && slides.length === 0 && (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Chưa có ảnh banner nào</p>
                  <p className="text-xs text-slate-500">
                    Bấm nút "Thêm slide banner" để tải lên ảnh nền di sản đầu tiên.
                  </p>
                </div>
              )}

              {/* Slides List */}
              <div className="space-y-3">
                {slides.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      s.is_active
                        ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                        : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                    }`}
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                        <img
                          src={s.image_url}
                          alt={s.title || 'Slide'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400';
                          }}
                        />
                        <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                          #{idx + 1}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {s.title || '(Chưa đặt tiêu đề)'}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                              s.is_active
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {s.is_active ? 'Đang chiếu' : 'Đang ẩn'}
                          </span>
                        </div>
                        {s.subtitle && (
                          <p className="text-[11px] text-slate-500 truncate">{s.subtitle}</p>
                        )}
                        {s.link_url && (
                          <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                            🔗 {s.link_url}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(s, 'up')}
                        disabled={idx === 0}
                        title="Di chuyển lên trước"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 transition cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(s, 'down')}
                        disabled={idx === slides.length - 1}
                        title="Di chuyển xuống sau"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 transition cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(s)}
                        title={s.is_active ? 'Tắt hiển thị slide này' : 'Bật hiển thị slide này'}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          s.is_active
                            ? 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-700'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {s.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        title="Chỉnh sửa slide"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s)}
                        title="Xóa slide"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: ADD / EDIT FORM */}
          {isFormOpen && (
            <form onSubmit={handleSaveForm} className="space-y-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition mb-2"
              >
                <ChevronLeft className="w-4 h-4" /> Quay lại danh sách slide
              </button>

              {/* Image Input & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Hình ảnh Banner <span className="text-rose-500">*</span>
                </label>

                {/* Upload or URL Row */}
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
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition shrink-0 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Đang tải lên...' : 'Tải ảnh từ máy tính'}</span>
                  </button>

                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Hoặc dán URL ảnh trực tiếp (https://...)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                {/* Live Preview Box */}
                {formData.image_url && (
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 mt-2">
                    <img
                      src={formData.image_url}
                      alt="Banner Preview"
                      className="w-full h-full object-cover brightness-[0.5] contrast-[1.05]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=600';
                      }}
                    />
                    {/* Visual Overlay Simulation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        Mô phỏng hiển thị với lớp phủ tối
                      </span>
                      <h5 className="font-bold text-sm truncate mt-0.5">
                        {formData.title || 'Khám Phá Dòng Chảy Văn Minh Lịch Sử 10'}
                      </h5>
                      <p className="text-[11px] text-slate-300 truncate">
                        {formData.subtitle || 'Kho tư liệu lịch sử chuẩn hóa theo Chương trình GDPT 2018...'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tiêu đề chú thích di sản (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Trống Đồng Ngọc Lũ (Đông Sơn)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Ghi chú phụ / Xuất xứ (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="VD: Bảo vật quốc gia - Bảo tàng Lịch sử Quốc gia"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>

              {/* Link & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Đường dẫn chuyển tiếp khi bấm (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="VD: /studio-3d/co-vat/dong_son_drum hoặc /kho-tu-lieu"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-navy focus:ring-navy cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Kích hoạt hiển thị trên trình chiếu Carousel
                  </span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition active:scale-95 shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingSlide ? 'Cập nhật slide' : 'Lưu slide mới'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!isFormOpen && (
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
            <span>
              Tổng cộng: <strong>{slides.length}</strong> slide trong hệ thống.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

