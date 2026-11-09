import React, { useState, useEffect } from 'react';
import {
  GraduationCap, BookOpen, FileText, HelpCircle, Save, X, Sparkles,
  CheckCircle2, ArrowRight, Layers, Tag, AlignLeft, Hash, Link as LinkIcon, ExternalLink
} from 'lucide-react';

export default function TeacherGuideEditorModal({
  material,
  isOpen,
  onClose,
  onSave,
  defaultCategory = 'cam_nang'
}) {
  const [formData, setFormData] = useState({
    category: 'cam_nang',
    title: '',
    subtitle: '',
    badge: '',
    content: '',
    technique: '',
    topic_url: '',
    doc_url: '',
    answer: '',
    order_index: 1
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (material) {
      let extra = {};
      if (typeof material.extra_data === 'string') {
        try {
          const parsed = JSON.parse(material.extra_data);
          if (parsed && typeof parsed === 'object') {
            extra = parsed;
          }
        } catch (e) {
          extra = {};
        }
      } else if (material.extra_data && typeof material.extra_data === 'object') {
        extra = material.extra_data;
      }
      if (!extra || typeof extra !== 'object') {
        extra = {};
      }

      setFormData({
        category: material.category || defaultCategory,
        title: material.title || '',
        subtitle: material.subtitle || '',
        badge: material.badge || '',
        content: material.content || '',
        technique: extra?.technique || extra?.method || '',
        topic_url: extra?.topic_url || extra?.link || '',
        doc_url: extra?.doc_url || extra?.doc_link || extra?.giao_an_url || extra?.lesson_plan_url || '',
        answer: extra?.answer || '',
        order_index: material.order_index ?? 1
      });
    } else {
      setFormData({
        category: defaultCategory,
        title: '',
        subtitle: '',
        badge: defaultCategory === 'cam_nang' ? '1' : defaultCategory === 'ke_hoach_5512' ? 'Khởi động' : 'Cấp độ 1: Nhận biết',
        content: '',
        technique: '',
        topic_url: defaultCategory === 'ke_hoach_5512' ? '/kho-tu-lieu?topic=4' : '',
        doc_url: '',
        answer: '',
        order_index: 1
      });
    }
    setErrorMsg('');
  }, [material, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề nội dung.');
      return;
    }
    if (!formData.content.trim()) {
      setErrorMsg('Vui lòng nhập nội dung chi tiết.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const extra_data = {};
      if (formData.technique.trim()) extra_data.technique = formData.technique.trim();
      if (formData.topic_url.trim()) extra_data.topic_url = formData.topic_url.trim();
      if (formData.doc_url.trim()) extra_data.doc_url = formData.doc_url.trim();
      if (formData.answer.trim()) extra_data.answer = formData.answer.trim();

      const payload = {
        category: formData.category,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || null,
        badge: formData.badge.trim() || null,
        content: formData.content.trim(),
        extra_data: Object.keys(extra_data).length > 0 ? extra_data : null,
        order_index: Number(formData.order_index) || 0
      };

      await onSave(payload, material?.id);
      onClose();
    } catch (err) {
      setErrorMsg('Lỗi khi lưu dữ liệu: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryTitle = () => {
    switch (formData.category) {
      case 'cam_nang':
        return 'Cẩm Nang Sư Phạm (Trụ cột năng lực GDPT 2018)';
      case 'ke_hoach_5512':
        return 'Kế Hoạch Bài Dạy 5512 (Hoạt động học tập)';
      case 'ngan_hang_cau_hoi':
        return 'Ngân Hàng Câu Hỏi & Đề Kiểm Tra';
      default:
        return 'Nội Dung Sư Phạm Cho Giáo Viên';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FFFDF5] rounded-3xl shadow-2xl border border-[#EBDBC5] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] text-white px-6 py-5 flex items-center justify-between border-b border-amber-300/30 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-amber-300/40 flex items-center justify-center text-[#FDE2A7]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FDE2A7]">
                {material ? 'Chỉnh Sửa Nội Dung' : 'Thêm Mới Nội Dung Sư Phạm'}
              </span>
              <h3 className="text-lg font-bold text-white font-serif-royal">
                {getCategoryTitle()}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF7E8] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-2">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Category Tabs */}
          <div>
            <label className="block text-[#850B10] font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Chuyên Mục Sư Phạm
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category: 'cam_nang', badge: prev.badge || '1' }))}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold border transition cursor-pointer ${
                  formData.category === 'cam_nang'
                    ? 'bg-[#850B10] text-white border-[#850B10] shadow-sm'
                    : 'bg-[#FAF5EB] hover:bg-[#FFFDF5] text-[#2D1B08] border-[#EBDBC5]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#FDE2A7]" />
                <span>Cẩm nang sư phạm</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category: 'ke_hoach_5512', badge: prev.badge || 'Khởi động' }))}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold border transition cursor-pointer ${
                  formData.category === 'ke_hoach_5512'
                    ? 'bg-[#850B10] text-white border-[#850B10] shadow-sm'
                    : 'bg-[#FAF5EB] hover:bg-[#FFFDF5] text-[#2D1B08] border-[#EBDBC5]'
                }`}
              >
                <FileText className="w-4 h-4 text-[#FDE2A7]" />
                <span>Kế hoạch bài dạy 5512</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category: 'ngan_hang_cau_hoi', badge: prev.badge || 'Cấp độ 1: Nhận biết' }))}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold border transition cursor-pointer ${
                  formData.category === 'ngan_hang_cau_hoi'
                    ? 'bg-[#850B10] text-white border-[#850B10] shadow-sm'
                    : 'bg-[#FAF5EB] hover:bg-[#FFFDF5] text-[#2D1B08] border-[#EBDBC5]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#FDE2A7]" />
                <span>Ngân hàng câu hỏi</span>
              </button>
            </div>
          </div>

          {/* Title & Badge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-600 font-bold mb-1">
                Tiêu đề mục / Tên hoạt động / Tên câu hỏi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={
                  formData.category === 'cam_nang'
                    ? 'VD: Tìm hiểu và Giải mã Tư liệu Lịch sử'
                    : formData.category === 'ke_hoach_5512'
                    ? 'VD: Hoạt động 1: Khởi động (Xác định vấn đề học tập)'
                    : 'VD: Câu 1: Bản khắc chữ Phạn (Sanskrit) cổ nhất tìm thấy ở Đông Nam Á có tên là gì?'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">
                Huy hiệu / Cấp độ / Số thứ tự
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder={
                  formData.category === 'cam_nang'
                    ? 'VD: 1 hoặc Trụ cột 1'
                    : formData.category === 'ke_hoach_5512'
                    ? 'VD: Khởi động hoặc Hoạt động 1'
                    : 'VD: Cấp độ 1: Nhận biết'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
              />
            </div>
          </div>

          {/* Subtitle & Order Index */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-600 font-bold mb-1">
                Phụ đề / Chuyên đề giảng dạy / Cấp độ nhận thức
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder={
                  formData.category === 'cam_nang'
                    ? 'VD: Năng lực tìm hiểu lịch sử qua hiện vật thực tế'
                    : formData.category === 'ke_hoach_5512'
                    ? 'VD: Chuyên đề: Văn minh Đông Nam Á thời cổ – trung đại'
                    : 'VD: Mức độ 1: Nhận biết'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">
                Thứ tự hiển thị (Order Index)
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
              />
            </div>
          </div>

          {/* Category specific fields */}
          {formData.category === 'ke_hoach_5512' && (
            <div className="space-y-3.5 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-900 font-bold mb-1">
                    Kỹ thuật / Phương pháp dạy học (5512)
                  </label>
                  <input
                    type="text"
                    value={formData.technique}
                    onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                    placeholder="VD: Kỹ thuật quan sát 3D / Phương pháp trạm di sản số / Khăn trải bàn..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-bold mb-1">
                    Đường dẫn liên kết tư liệu (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.topic_url}
                    onChange={(e) => setFormData({ ...formData, topic_url: e.target.value })}
                    placeholder="VD: /kho-tu-lieu?topic=4"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Link giáo án Google Docs (URL)</span>
                  </span>
                  <span className="text-[10px] text-amber-800/80 font-normal">Sẽ mở trong tab mới khi người dùng nhấn vào</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.doc_url}
                    onChange={(e) => setFormData({ ...formData, doc_url: e.target.value })}
                    placeholder="VD: https://docs.google.com/document/d/... (hoặc link chia sẻ giáo án online)"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-amber-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                  />
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {formData.category === 'ngan_hang_cau_hoi' && (
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70">
              <label className="block text-blue-900 font-bold mb-1">
                Đáp án đúng / Định hướng giải chi tiết
              </label>
              <input
                type="text"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="VD: B. Bia Võ Cạnh (Khánh Hòa) hoặc Đáp án định hướng phân tích..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-blue-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
              />
            </div>
          )}

          {/* Content (Textarea) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-600 font-bold">
                Nội dung chi tiết <span className="text-rose-500">*</span>
              </label>
              <span className="text-slate-400 text-[10px]">
                {formData.category === 'cam_nang'
                  ? 'Mô tả định hướng phát triển năng lực'
                  : formData.category === 'ke_hoach_5512'
                  ? 'Nội dung và tiến trình tổ chức hoạt động'
                  : 'Nội dung câu hỏi và các phương án lựa chọn (A, B, C, D)'}
              </span>
            </div>
            <textarea
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={
                formData.category === 'cam_nang'
                  ? 'Nhập mô tả chi tiết phương pháp sư phạm và chỉ dẫn sử dụng hiện vật...'
                  : formData.category === 'ke_hoach_5512'
                  ? 'Nhập nội dung hoạt động học tập, nhiệm vụ giao cho học sinh và sản phẩm dự kiến...'
                  : 'A. Phương án 1 • B. Phương án 2 [Đúng] • C. Phương án 3 • D. Phương án 4'
              }
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10] leading-relaxed"
              required
            />
          </div>

          {/* Live Preview Card */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Xem trước hiển thị (Live Preview)
            </span>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gold/20 text-[#850B10] uppercase border border-gold/40">
                  {formData.badge || 'Huy hiệu'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Thứ tự: {formData.order_index}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                {formData.title || '(Chưa có tiêu đề)'}
              </h4>
              {formData.subtitle && (
                <p className="text-[11px] font-semibold text-gold-dark">
                  {formData.subtitle}
                </p>
              )}
              {formData.technique && (
                <p className="text-[11px] font-bold text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                  {formData.technique}
                </p>
              )}
              <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                {formData.content || '(Chưa có nội dung)'}
              </p>
              {formData.doc_url && (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="shrink-0">Giáo án Google Docs:</span>
                    <span className="font-mono text-[10px] text-blue-600 truncate">{formData.doc_url}</span>
                  </div>
                  <a
                    href={formData.doc_url.startsWith('http') ? formData.doc_url : `https://${formData.doc_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shrink-0 transition"
                  >
                    <span>Mở tab mới</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {formData.answer && (
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  ✓ Đáp án: {formData.answer}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-[#FAF5EB] border-t border-[#EBDBC5] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white font-bold text-xs transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#FDE2A7]" />
            <span>{saving ? 'Đang lưu...' : material ? 'Cập nhật nội dung' : 'Lưu nội dung mới'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

