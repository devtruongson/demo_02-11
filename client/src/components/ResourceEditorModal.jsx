import {
    Image,
    RefreshCw,
    Save,
    Trash2,
    Upload,
    Box,
    Sparkles,
    Award,
    HelpCircle,
    CheckCircle2,
    RotateCcw,
    Link2,
    Plus,
    ArrowUp,
    ArrowDown,
    Lightbulb
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_5512_ACTIVITIES } from '../utils/activityHelper.js';

export default function ResourceEditorModal({ resource, topics, onClose, onSave }) {
  const [formData, setFormData] = useState({
    topic_id: 4,
    lesson: 'Văn minh Đông Nam Á thời cổ – trung đại',
    type: 'image',
    title: '',
    period: 'Cổ – trung đại',
    place: 'Đông Nam Á',
    description: '',
    source: '',
    url: '',
    img: '',
    gallery: [],
    video_url: '',
    tip: '',
    model_3d: ''
  });

  const [saving, setSaving] = useState(false);
  const [uploadingSingle, setUploadingSingle] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);
  const [showUrlGalleryInput, setShowUrlGalleryInput] = useState(false);
  const [activities, setActivities] = useState([]);
  const singleFileInputRef = useRef(null);
  const multiFileInputRef = useRef(null);

  useEffect(() => {
    if (resource) {
      let galList = [];
      if (Array.isArray(resource.gallery)) {
        galList = resource.gallery;
      } else if (typeof resource.gallery === 'string') {
        try {
          const norm = resource.gallery.replace(/'/g, '"');
          const parsed = JSON.parse(norm);
          if (Array.isArray(parsed)) galList = parsed;
          else galList = resource.gallery.split('\n').filter(Boolean);
        } catch {
          galList = resource.gallery.split('\n').filter(Boolean);
        }
      }

      let initActs = [];
      if (resource.tip) {
        if (Array.isArray(resource.tip)) {
          initActs = resource.tip.map((item, idx) => ({
            id: item.id || `act-${Date.now()}-${idx}`,
            title: item.title || `Hoạt động ${idx + 1}:`,
            content: item.content || item.desc || (typeof item === 'string' ? item : ''),
            doc_url: item.doc_url || item.doc_link || item.link || item.giao_an_url || ''
          }));
        } else if (typeof resource.tip === 'string') {
          try {
            const parsed = JSON.parse(resource.tip);
            if (Array.isArray(parsed)) {
              initActs = parsed.map((item, idx) => ({
                id: item.id || `act-${Date.now()}-${idx}`,
                title: item.title || `Hoạt động ${idx + 1}:`,
                content: item.content || item.desc || (typeof item === 'string' ? item : ''),
                doc_url: item.doc_url || item.doc_link || item.link || item.giao_an_url || ''
              }));
            } else if (typeof parsed === 'string' && parsed.trim()) {
              initActs = [{
                id: `act-${Date.now()}-0`,
                title: 'Gợi ý sư phạm:',
                content: parsed.trim(),
                doc_url: ''
              }];
            }
          } catch {
            if (resource.tip.trim()) {
              initActs = [{
                id: `act-${Date.now()}-0`,
                title: 'Gợi ý sư phạm:',
                content: resource.tip.trim(),
                doc_url: ''
              }];
            }
          }
        }
      }
      setActivities(initActs);

      setFormData({
        topic_id: resource.topic_id || 4,
        lesson: resource.lesson || '',
        type: resource.type || 'image',
        title: resource.title || '',
        period: resource.period || '',
        place: resource.place || '',
        description: resource.description || '',
        source: resource.source || '',
        url: resource.url || '',
        img: resource.img || '',
        gallery: galList.length > 0 ? galList : (resource.img ? [resource.img] : []),
        video_url: resource.video_url || '',
        tip: resource.tip || '',
        model_3d: resource.model_3d || ''
      });
    } else {
      setActivities([]);
    }
  }, [resource]);

  // Dynamic Activities Handlers
  const handleAddActivity = () => {
    setActivities((prev) => [
      ...prev,
      {
        id: `act-${Date.now()}-${prev.length}`,
        title: `${prev.length + 1}. Hoạt động:`,
        content: ''
      }
    ]);
  };

  const handleUpdateActivity = (index, field, value) => {
    setActivities((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveActivity = (index) => {
    setActivities((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveActivity = (index, direction) => {
    setActivities((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleLoadDefaultTemplates = () => {
    setActivities(
      DEFAULT_5512_ACTIVITIES.map((act, idx) => ({
        ...act,
        id: `act-${Date.now()}-${idx}`
      }))
    );
  };

  const handleClearActivities = () => {
    setActivities([]);
  };

  // Handle Single Image Upload (Ảnh đại diện chính)
  const handleSingleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSingle(true);
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
        img: result.url,
        // If gallery is empty, also add it as first gallery item
        gallery: prev.gallery.length === 0 ? [result.url] : prev.gallery
      }));
    } catch (err) {
      alert('Tải ảnh thất bại: ' + err.message);
    } finally {
      setUploadingSingle(false);
      if (singleFileInputRef.current) singleFileInputRef.current.value = '';
    }
  };

  // Handle Multiple Images Upload (Bộ sưu tập ảnh)
  const handleMultipleFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingMultiple(true);
    try {
      const data = new FormData();
      files.forEach((f) => data.append('images', f));

      const res = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: data
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi tải bộ sưu tập ảnh');
      }

      const result = await res.json();
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...result.urls]
      }));
    } catch (err) {
      alert('Tải bộ sưu tập ảnh thất bại: ' + err.message);
    } finally {
      setUploadingMultiple(false);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  // Remove photo from gallery
  const handleRemoveGalleryPhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Insert description templates
  const handleInsertTemplate = (heading) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description
        ? `${prev.description}\n\n${heading}\n`
        : `${heading}\n`
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên tư liệu / hiện vật.');
      return;
    }

    setSaving(true);
    try {
      const validActs = activities
        .map((a) => ({
          title: a.title?.trim() || '',
          content: a.content?.trim() || ''
        }))
        .filter((a) => a.title || a.content);

      const payload = {
        ...formData,
        gallery: formData.gallery.length > 0 ? formData.gallery : [formData.img],
        tip: validActs.length > 0 ? JSON.stringify(validActs) : ''
      };

      await onSave(payload, resource?.id);
      onClose();
    } catch (err) {
      alert('Lỗi lưu dữ liệu: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fade-in p-2 sm:p-4 lg:p-6">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden"
      >
        {/* ================= STICKY TOP BAR ================= */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-navy text-white flex items-center justify-center font-black shadow-sm">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {resource ? 'Chỉnh Sửa Hồ Sơ Tư Liệu & Di Tích' : 'Thêm Mới Tư Liệu Di Tích Lịch Sử 10'}
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Đang hoạt động
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Trình biên soạn học liệu: tải ảnh tư liệu chất lượng cao, thiết lập bộ sưu tập hình ảnh và video tư liệu bài học.
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
                  <span>Đang lưu</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-gold" />
                  <span>Lưu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE 2-COLUMN BODY ================= */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ----------------- LEFT COLUMN: SCHOLARLY DOSSIER (7 COLS) ----------------- */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-navy bg-navy-soft px-3 py-1 rounded-full inline-block">
                  Thông tin định danh tư liệu
                </span>

                {/* Title */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Tên tư liệu / Tên di tích lịch sử *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Lăng mộ Taj Mahal – Tuyệt tác cẩm thạch Mogul..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                  />
                </div>

                {/* Topic & Format Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chủ đề chương trình GDPT 2018 *
                    </label>
                    <select
                      value={formData.topic_id}
                      onChange={(e) => setFormData({ ...formData, topic_id: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                    >
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          Chủ đề {t.id}: {t.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Loại định dạng hiển thị *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                    >
                      <option value="image">Hình ảnh & Bộ sưu tập HD</option>
                      <option value="3d">Mô hình 3D tương tác 360°</option>
                      <option value="video">Thước phim tài liệu lịch sử</option>
                      <option value="text">Văn bản / Bia ký cổ ngữ</option>
                    </select>
                  </div>
                </div>

                {/* Lesson SGK */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bài học / Chuyên đề trong Sách giáo khoa
                  </label>
                  <input
                    type="text"
                    value={formData.lesson}
                    onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                    placeholder="Ví dụ: Văn minh Ấn Độ thời cổ – trung đại"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                  />
                </div>

                {/* Period & Place */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Thời kỳ / Niên đại khảo cổ
                    </label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="Ví dụ: Thế kỷ XVII, Triều đại Mogul..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Địa điểm / Quốc gia
                    </label>
                    <input
                      type="text"
                      value={formData.place}
                      onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                      placeholder="Ví dụ: Agra, Ấn Độ / Việt Nam..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                    />
                  </div>
                </div>

                {/* 3D Embed (100% HTML Embed / Iframe) */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-navy" />
                      <span>Mã nhúng mô hình 3D (HTML Embed / Sketchfab)</span>
                    </label>
                    {formData.model_3d && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, model_3d: '' })}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Xóa mã 3D
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    value={formData.model_3d || ''}
                    onChange={(e) => setFormData({ ...formData, model_3d: e.target.value })}
                    placeholder={`Dán trực tiếp toàn bộ mã nhúng HTML từ Sketchfab tại đây, ví dụ:\n<div class="sketchfab-embed-wrapper">\n  <iframe title="..." src="https://sketchfab.com/models/.../embed"></iframe>\n</div>`}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-mono text-slate-800 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs leading-relaxed"
                  />

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-medium">Mẫu 3D tích hợp nhanh:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, model_3d: 'dong_son_drum' })}
                      className={`px-2.5 py-1 rounded-xl font-bold transition border ${formData.model_3d === 'dong_son_drum' ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Trống đồng
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, model_3d: 'borobudur_stupa' })}
                      className={`px-2.5 py-1 rounded-xl font-bold transition border ${formData.model_3d === 'borobudur_stupa' ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Borobudur
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, model_3d: 'linga_yoni' })}
                      className={`px-2.5 py-1 rounded-xl font-bold transition border ${formData.model_3d === 'linga_yoni' ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Linga - Yoni
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, model_3d: 'vo_canh_stele' })}
                      className={`px-2.5 py-1 rounded-xl font-bold transition border ${formData.model_3d === 'vo_canh_stele' ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Bia Võ Cạnh
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, model_3d: 'that_luang' })}
                      className={`px-2.5 py-1 rounded-xl font-bold transition border ${formData.model_3d === 'that_luang' ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Thạt Luổng
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Hỗ trợ 100% mã nhúng iframe HTML từ Sketchfab. Hệ thống sẽ tự động hiển thị mô hình tương tác 360° nguyên bản.
                  </p>
                </div>

                {/* Video bài học YouTube */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Liên kết Video bài học (YouTube Embed)
                  </label>
                  <input
                    type="text"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Hệ thống sẽ tự động phân giải liên kết YouTube và hiển thị tràn khung hình 16:9 sắc nét.
                  </p>
                </div>
              </div>

              {/* Rich Multi-Paragraph Description */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-800">
                    Mô tả lịch sử & giá trị hiện vật (Biên soạn chuyên sâu)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formData.description.length} ký tự
                  </span>
                </div>

                {/* Template Helpers */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-bold">Thêm đề mục:</span>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('1. Bối cảnh lịch sử & Niên đại vương triều:')}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition"
                  >
                    + 1. Bối cảnh lịch sử
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('2. Đỉnh cao kiến trúc & Kỹ nghệ chế tác:')}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition"
                  >
                    + 2. Đỉnh cao kiến trúc
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('3. Cảnh quan & Không gian thực địa:')}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition"
                  >
                    + 3. Cảnh quan & hồ gương
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('4. Giá trị văn hóa & Khai thác sư phạm:')}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition"
                  >
                    + 4. Giá trị sư phạm
                  </button>
                </div>

                <textarea
                  rows={8}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập bài thuyết minh chi tiết về hoàn cảnh ra đời, nghệ thuật kiến trúc, kỹ thuật chạm khắc và giá trị lịch sử..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                />
              </div>

              {/* Pedagogical Activities Section (Chuẩn 5512 - Tùy biến động cho từng tư liệu) */}
              <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-200/70">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                      Gợi ý tổ chức hoạt động học tập (Chuẩn 5512)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleLoadDefaultTemplates}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold border border-amber-300 transition flex items-center gap-1"
                      title="Nạp nhanh 3 hoạt động mẫu theo chuẩn công văn 5512"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>Nạp mẫu 5512</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="px-2.5 py-1 rounded-lg bg-navy hover:bg-navy-light text-white text-[11px] font-black transition flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm hoạt động</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  {activities.length === 0
                    ? 'Chưa thiết lập hoạt động tùy chỉnh. Hệ thống sẽ tự động hiển thị 3 hoạt động chuẩn 5512 mặc định khi xem bài. Nhấn "Nạp mẫu 5512" để tùy biến hoặc "Thêm hoạt động" để tạo mới.'
                    : `Đang có ${activities.length} hoạt động tùy chỉnh cho tư liệu này. Bạn có thể thêm, bớt hoặc đổi thứ tự tùy ý.`}
                </p>

                {activities.length > 0 && (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {activities.map((act, index) => (
                      <div
                        key={act.id || index}
                        className="p-3.5 bg-white rounded-2xl border border-amber-200/90 shadow-2xs space-y-2 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                            Mục #{index + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveActivity(index, -1)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 transition"
                              title="Di chuyển lên"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === activities.length - 1}
                              onClick={() => handleMoveActivity(index, 1)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 transition"
                              title="Di chuyển xuống"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveActivity(index)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition ml-1"
                              title="Xóa mục này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={act.title}
                            onChange={(e) => handleUpdateActivity(index, 'title', e.target.value)}
                            placeholder={`Tiêu đề (VD: ${index + 1}. Hoạt động Khởi động (5 phút):)`}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
                          />
                        </div>

                        <div>
                          <textarea
                            rows={2}
                            value={act.content}
                            onChange={(e) => handleUpdateActivity(index, 'content', e.target.value)}
                            placeholder="Nội dung chi tiết, câu hỏi định hướng, gợi ý giao nhiệm vụ cho học sinh..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50/50 leading-relaxed"
                          />
                        </div>

                        <div>
                          <input
                            type="url"
                            value={act.doc_url || ''}
                            onChange={(e) => handleUpdateActivity(index, 'doc_url', e.target.value)}
                            placeholder="Link giáo án Google Docs (tùy chọn, VD: https://docs.google.com/...)"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-[11px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activities.length > 0 && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 underline underline-offset-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm mục hoạt động khác</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearActivities}
                      className="text-[11px] text-slate-500 hover:text-rose-600 transition"
                    >
                      Xóa tất cả (Dùng 3 mục mặc định)
                    </button>
                  </div>
                )}
              </div>

              {/* Source & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cơ quan lưu giữ / Nguồn tư liệu
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Bảo tàng Lịch sử Quốc gia, UNESCO..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Liên kết tài liệu gốc (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* ----------------- RIGHT COLUMN: MEDIA UPLOAD & GALLERY (5 COLS) ----------------- */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* SECTION A: MAIN COVER PHOTO UPLOAD */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-800">
                    Ảnh đại diện chính (Cover Image)
                  </label>
                  {uploadingSingle && (
                    <span className="text-[11px] text-navy font-bold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang tải lên...
                    </span>
                  )}
                </div>

                {/* Preview Box */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-slate-200 flex items-center justify-center group">
                  {formData.img ? (
                    <>
                      <img
                        src={formData.img}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => singleFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow hover:bg-slate-100"
                        >
                          Đổi ảnh khác
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Image className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-medium">Chưa có ảnh đại diện</p>
                    </div>
                  )}
                </div>

                {/* File Upload Button for Cover */}
                <input
                  ref={singleFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSingleFileUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => singleFileInputRef.current?.click()}
                    disabled={uploadingSingle}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-bold text-xs transition shadow-2xs active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Tải ảnh đại diện từ máy tính</span>
                  </button>
                </div>

                {/* URL Input Fallback */}
                <div>
                  <input
                    type="text"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="Hoặc dán đường dẫn ảnh: https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* SECTION B: MULTIPLE GALLERY PHOTOS UPLOAD */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800">
                      Bộ sưu tập nhiều ảnh di tích ({formData.gallery.length} ảnh)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Tải lên nhiều góc chụp (toàn cảnh, phù điêu, di tích, khảo cổ)
                    </p>
                  </div>

                  {uploadingMultiple && (
                    <span className="text-[11px] text-navy font-bold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang tải nhiều ảnh...
                    </span>
                  )}
                </div>

                {/* File Upload Button for Multiple Photos */}
                <input
                  ref={multiFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFilesUpload}
                  className="hidden"
                />

                <div
                  onClick={() => multiFileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-navy/30 hover:border-navy bg-white hover:bg-navy-soft/30 rounded-2xl cursor-pointer transition text-center space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-navy/10 group-hover:bg-navy text-navy group-hover:text-white flex items-center justify-center mx-auto transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-xs text-slate-800 block font-bold">
                      Nhấn để tải lên nhiều ảnh cùng lúc từ máy tính
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      Hỗ trợ chọn nhiều tệp JPG, PNG, WEBP lên máy chủ
                    </span>
                  </div>
                </div>

                {/* Gallery Photos Grid Preview */}
                {formData.gallery.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Các ảnh đang có trong bộ sưu tập:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto p-1">
                      {formData.gallery.map((photoUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-900"
                        >
                          <img
                            src={photoUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(idx)}
                            title="Xóa ảnh này khỏi bộ sưu tập"
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm hover:scale-110"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded pointer-events-none">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Toggle Raw URLs Textarea */}
                <div className="pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowUrlGalleryInput(!showUrlGalleryInput)}
                    className="text-[11px] font-bold text-navy hover:underline flex items-center gap-1"
                  >
                    <span>{showUrlGalleryInput ? 'Ẩn ô dán đường dẫn URL' : '+ Dán nhiều đường dẫn ảnh thủ công (URL)'}</span>
                  </button>

                  {showUrlGalleryInput && (
                    <div className="mt-2 space-y-1">
                      <textarea
                        rows={3}
                        value={formData.gallery.join('\n')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                          })
                        }
                        placeholder="Mỗi dòng 1 đường dẫn URL ảnh..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ================= STICKY FOOTER ================= */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-medium hidden sm:inline">
            Dữ liệu và tư liệu hình ảnh được lưu trữ an toàn, sẵn sàng phục vụ công tác giảng dạy và học tập.
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
                  <span>Lưu Hồ Sơ Hoàn Tất</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
