import React, { useState, useEffect, useRef } from 'react';
import { Box, Sparkles, Save, RefreshCw, X, Code2, Trash2, Eye, Info, Check, Upload, Image as ImageIcon } from 'lucide-react';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';

export default function Artifact3DEditorModal({
  artifact,
  isOpen,
  onClose,
  onSave,
  authToken
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    culture: '',
    period: '',
    location: '',
    material: '',
    dimensions: '',
    significance: '',
    description: '',
    embed: '',
    img: '',
    lighting_preset: 'museum',
    color_base: '#b58b4c'
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('live'); // 'live' or 'code'
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (artifact) {
      setFormData({
        name: artifact.name || '',
        code: artifact.code || '',
        culture: artifact.culture || '',
        period: artifact.period || '',
        location: artifact.location || '',
        material: artifact.material || '',
        dimensions: artifact.dimensions || '',
        significance: artifact.significance || '',
        description: artifact.description || '',
        embed: artifact.embed || '',
        img: artifact.img || '',
        lighting_preset: artifact.lighting_preset || 'museum',
        color_base: artifact.color_base || '#b58b4c'
      });
    } else {
      setFormData({
        name: '',
        code: '',
        culture: '',
        period: '',
        location: '',
        material: '',
        dimensions: '',
        significance: '',
        description: '',
        embed: '',
        img: '',
        lighting_preset: 'museum',
        color_base: '#b58b4c'
      });
    }
  }, [artifact, isOpen]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    try {
      const data = new FormData();
      data.append('image', file);

      const res = await fetch('/api/upload/single', {
        method: 'POST',
        body: data
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi tải ảnh lên máy chủ');
      }

      const result = await res.json();
      setFormData((prev) => ({
        ...prev,
        img: result.url
      }));
    } catch (err) {
      alert('Tải ảnh thất bại: ' + err.message);
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên bảo vật 3D');
      return;
    }
    if (!formData.code.trim()) {
      alert('Vui lòng nhập mã định danh (code)');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData, artifact?.id);
      onClose();
    } catch (err) {
      alert('Lỗi khi lưu bảo vật 3D: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    // Auto-generate slug code if adding new artifact and code is empty or untouched
    if (!artifact && (!formData.code || formData.code === generateCode(formData.name))) {
      setFormData((prev) => ({
        ...prev,
        name: newName,
        code: generateCode(newName)
      }));
    } else {
      setFormData((prev) => ({ ...prev, name: newName }));
    }
  };

  const generateCode = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const sampleDongSonEmbed = `<div class="sketchfab-embed-wrapper"> <iframe title="Trống đồng Đông Sơn - Việt Nam" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/21e418a517a74b49a17ebbad94ba26c0/embed"> </iframe> <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;"> <a href="https://sketchfab.com/3d-models/trong-ong-ong-son-viet-nam-21e418a517a74b49a17ebbad94ba26c0" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> Trống đồng Đông Sơn - Việt Nam </a> by <a href="https://sketchfab.com/ndnguyen3d" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> ndnguyen3d </a> on <a href="https://sketchfab.com" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a></p></div>`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fade-in p-2 sm:p-4 lg:p-6">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden"
      >
        {/* ================= MODAL TOPBAR ================= */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/20 text-gold-dark flex items-center justify-center font-black border border-gold/40 shadow-sm">
              <Box className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {artifact ? 'Chỉnh Sửa Bảo Vật Studio 3D' : 'Thêm Mới Bảo Vật Studio 3D'}
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Studio 3D Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Quản lý hiện vật 3D tương tác, gắn mã nhúng HTML Sketchfab và thông tin khảo cổ học phục vụ giảng dạy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition"
            >
              Hủy bỏ (ESC)
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-black transition shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-gold" />
                  <span>Lưu Bảo Vật 3D</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE 2-COLUMN FORM ================= */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ----------------- LEFT COLUMN: SCHOLARLY INFO (6 COLS) ----------------- */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-navy bg-navy-soft px-3 py-1 rounded-full inline-block">
                  Thông Tin Học Thuật & Khảo Cổ
                </span>

                {/* Tên bảo vật */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên bảo vật / Cổ vật 3D <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Ví dụ: Trống đồng Ngọc Lũ (Đông Sơn)..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                  />
                </div>

                {/* Mã định danh (Code / Slug) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã định danh (Code URL / Slug) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ví dụ: dong_son_drum, borobudur_stupa..."
                    className="w-full px-4 py-2 rounded-2xl border border-slate-300 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Dùng trong đường dẫn URL (/studio-3d/co-vat/:code) và làm mã nhận diện mô hình có sẵn.
                  </p>
                </div>

                {/* Văn hóa & Niên đại */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nền văn hóa / Nền văn minh
                    </label>
                    <input
                      type="text"
                      value={formData.culture}
                      onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                      placeholder="Văn hóa Đông Sơn (Việt Nam)..."
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Thời kỳ / Niên đại
                    </label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="Thế kỷ III – II TCN..."
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                    />
                  </div>
                </div>

                {/* Nơi lưu giữ & Chất liệu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nơi lưu giữ / Hiện vật khảo cổ
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Hà Nam, Việt Nam (Hiện vật BTLSQG)..."
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chất liệu chế tác
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="Đồng thau cổ, Sa thạch xám..."
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                    />
                  </div>
                </div>

                {/* Kích thước */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kích thước & Trọng lượng
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="Đường kính 86 cm, Chiều cao 63 cm, Nặng 86 kg..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                  />
                </div>

                {/* Ý nghĩa lịch sử & Bảo vật quốc gia */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ý nghĩa lịch sử & Giá trị di sản
                  </label>
                  <textarea
                    rows={2}
                    value={formData.significance}
                    onChange={(e) => setFormData({ ...formData, significance: e.target.value })}
                    placeholder="Bảo vật quốc gia số 1, minh chứng cho sự thăng hoa tột bực của kỹ nghệ luyện kim đúc đồng..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs leading-relaxed"
                  />
                </div>

                {/* Mô tả chi tiết hiện vật */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mô tả chi tiết hoa văn & kiến trúc
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết mặt trống, hoa văn ngôi sao 14 cánh, bầy chim Lạc, vũ hội..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* ----------------- RIGHT COLUMN: THUMBNAIL, 3D EMBED & LIVE PREVIEW (6 COLS) ----------------- */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* SECTION: THUMBNAIL IMAGE FOR 3D CARD */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block border border-amber-200">
                      Ảnh Thumbnail Thẻ Bảo Vật 3D
                    </span>
                  </div>
                  {uploadingImg && (
                    <span className="text-[11px] text-navy font-bold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang tải lên...
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  Hiển thị trên thẻ bảo vật ở Không gian 3D và Trang chủ. Nếu để trống, hệ thống sẽ tự động hiển thị biểu tượng mô hình 3D mặc định như hiện tại.
                </p>

                {/* Thumbnail Preview Box */}
                <div className="relative aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-slate-200 flex items-center justify-center group">
                  {formData.img ? (
                    <>
                      <img
                        src={formData.img}
                        alt="Thumbnail Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow hover:bg-slate-100 transition"
                        >
                          Đổi ảnh khác
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, img: '' }))}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow hover:bg-rose-700 transition"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#850B10] border border-[#850B10]/20 flex flex-col items-center justify-center mx-auto mb-2 shadow-2xs">
                        <Box className="w-6 h-6 text-[#850B10]/70" />
                      </div>
                      <p className="text-xs text-slate-600 font-bold">Chưa có ảnh thumbnail</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Sẽ hiển thị thẻ mô hình 3D mặc định</p>
                    </div>
                  )}
                </div>

                {/* File input (hidden) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImg}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-bold text-xs transition shadow-2xs active:scale-95 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Tải ảnh từ máy tính</span>
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.img}
                    onChange={(e) => setFormData((prev) => ({ ...prev, img: e.target.value }))}
                    placeholder="Hoặc dán đường dẫn ảnh: https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white placeholder:text-slate-400 shadow-2xs"
                  />
                </div>
              </div>

              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block border border-amber-200">
                    Mã Nhúng 3D (HTML Embed / Sketchfab)
                  </span>
                  {formData.embed && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, embed: '' })}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa mã nhúng
                    </button>
                  )}
                </div>

                {/* Textarea for Embed */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dán toàn bộ mã nhúng HTML từ Sketchfab
                  </label>
                  <textarea
                    rows={5}
                    value={formData.embed}
                    onChange={(e) => setFormData({ ...formData, embed: e.target.value })}
                    placeholder={`Dán mã nhúng HTML vào đây, ví dụ:\n<div class="sketchfab-embed-wrapper">\n  <iframe title="..." src="https://sketchfab.com/models/.../embed"></iframe>\n</div>`}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-mono text-slate-800 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs leading-relaxed"
                  />
                </div>

                {/* Quick Helper Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, embed: sampleDongSonEmbed })}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-100 transition shadow-2xs"
                  >
                    Dán mã mẫu Trống đồng Sketchfab
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, embed: '' })}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-500 text-[11px] font-bold hover:bg-slate-100 transition shadow-2xs"
                  >
                    Dùng mô hình 3D tích hợp mặc định
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${formData.embed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="font-bold text-slate-800">
                      Chế độ 3D: {formData.embed ? 'Mã nhúng HTML Sketchfab' : 'Mô hình WebGL 3D tích hợp'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formData.embed ? 'dangerouslySetInnerHTML' : (formData.code || 'default')}
                  </span>
                </div>

                {/* Live Preview Screen */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-navy" />
                      <span>Xem trước mô hình 3D tương tác xoay 360°</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Xem trực tiếp kết quả</span>
                  </div>

                  <div className="h-[340px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                    <ThreeArtifactViewer
                      modelCode={formData.embed || formData.code || 'dong_son_drum'}
                      artifactInfo={{ name: formData.name || 'Mô hình thử nghiệm' }}
                      height="100%"
                      showControls={true}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    🖱️ Kéo chuột để xoay 360 độ • Cuộn chuột để phóng to / thu nhỏ
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* ================= MODAL FOOTER ================= */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-medium hidden sm:inline">
            Học sinh có thể tương tác xoay 360° với bảo vật 3D này tại Studio 3D (/studio-3d/co-vat/{formData.code || '...'}).
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white font-black transition shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-gold" />
                  <span>Lưu Bảo Vật Hoàn Tất</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

