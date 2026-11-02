import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Award, BookOpen, Box, Compass, Sparkles, CheckSquare } from 'lucide-react';

export default function StudentTaskEditorModal({
  task = null,
  isOpen = false,
  onClose,
  onSave
}) {
  const isEditing = Boolean(task && task.id);

  const [formData, setFormData] = useState({
    title: '',
    lesson: 'Bài 11: Một số nền văn minh cổ trên đất nước Việt Nam',
    difficulty: 'thong_hieu',
    target_type: '3d',
    target_title: '',
    target_url: '/studio-3d/co-vat/dong_son_drum',
    badge: 'Bảo Vật Quốc Gia',
    reward_xp: 100,
    description: '',
    checklist: [
      'Mở mô hình 3D và quan sát tổng thể hiện vật',
      'Phóng to để nhận diện các hoa văn tiêu biểu',
      'Đọc phần thẩm định niên đại và xuất xứ'
    ],
    reflection_prompt: '',
    order_index: 0
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        lesson: task.lesson || 'Bài 11: Một số nền văn minh cổ trên đất nước Việt Nam',
        difficulty: task.difficulty || 'thong_hieu',
        target_type: task.target_type || '3d',
        target_title: task.target_title || '',
        target_url: task.target_url || '/studio-3d',
        badge: task.badge || 'Khám Phá Di Sản',
        reward_xp: task.reward_xp || 100,
        description: task.description || '',
        checklist: Array.isArray(task.checklist) ? task.checklist : (typeof task.checklist === 'string' ? JSON.parse(task.checklist || '[]') : []),
        reflection_prompt: task.reflection_prompt || '',
        order_index: task.order_index || 0
      });
    } else {
      setFormData({
        title: '',
        lesson: 'Bài 11: Một số nền văn minh cổ trên đất nước Việt Nam',
        difficulty: 'thong_hieu',
        target_type: '3d',
        target_title: '',
        target_url: '/studio-3d/co-vat/dong_son_drum',
        badge: 'Bảo Vật Quốc Gia',
        reward_xp: 100,
        description: '',
        checklist: [
          'Mở mô hình 3D và quan sát tổng thể hiện vật',
          'Phóng to để nhận diện các hoa văn tiêu biểu',
          'Đọc phần thẩm định niên đại và xuất xứ'
        ],
        reflection_prompt: '',
        order_index: 0
      });
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleChecklistChange = (index, value) => {
    const updated = [...formData.checklist];
    updated[index] = value;
    setFormData({ ...formData, checklist: updated });
  };

  const handleAddChecklist = () => {
    setFormData({
      ...formData,
      checklist: [...formData.checklist, '']
    });
  };

  const handleRemoveChecklist = (index) => {
    if (formData.checklist.length <= 1) return;
    const updated = formData.checklist.filter((_, idx) => idx !== index);
    setFormData({ ...formData, checklist: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề nhiệm vụ.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Vui lòng nhập mô tả nhiệm vụ.');
      return;
    }
    const cleanChecklist = formData.checklist.map((c) => c.trim()).filter(Boolean);
    if (cleanChecklist.length === 0) {
      setError('Vui lòng cung cấp ít nhất 1 bước trong checklist nhiệm vụ.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSave({
        ...formData,
        checklist: cleanChecklist,
        reward_xp: Number(formData.reward_xp) || 100,
        order_index: Number(formData.order_index) || 0
      }, task?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu nhiệm vụ học tập.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {isEditing ? 'Chỉnh Sửa Nhiệm Vụ Học Tập' : 'Thêm Nhiệm Vụ Học Tập Mới'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Thiết kế nhiệm vụ rèn luyện năng lực tự học cho học sinh Lớp 10
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              Tiêu Đề Nhiệm Vụ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ví dụ: Giải Mã Biểu Tượng Sùng Bái Mặt Trời Trên Trống Đồng Ngọc Lũ"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-navy"
            />
          </div>

          {/* Lesson & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Bài Học / Chuyên Đề GDPT 2018 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lesson}
                onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                placeholder="Ví dụ: Bài 11: Một số nền văn minh cổ trên đất nước Việt Nam"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Huy Hiệu Nhiệm Vụ
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Ví dụ: Bảo Vật Quốc Gia, Di Sản UNESCO, Hải Trình Số"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {/* Difficulty & XP Reward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Mức Độ Yêu Cầu
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-navy"
              >
                <option value="co_ban">Cơ bản (Khám phá & nhận biết)</option>
                <option value="thong_hieu">Thông hiểu (Giải mã hoa văn & bối cảnh)</option>
                <option value="van_dung">Vận dụng (So sánh & phản biện lịch sử)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Điểm Thưởng (XP)
              </label>
              <input
                type="number"
                value={formData.reward_xp}
                onChange={(e) => setFormData({ ...formData, reward_xp: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {/* Target Type, Target Title & Target URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Loại Hiện Vật Đích
              </label>
              <select
                value={formData.target_type}
                onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-navy"
              >
                <option value="3d">Mô hình 3D xoay 360°</option>
                <option value="resource">Bài tư liệu số</option>
                <option value="quiz">Bài tập trắc nghiệm</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Tên Đối Tượng Thực Hành
              </label>
              <input
                type="text"
                value={formData.target_title}
                onChange={(e) => setFormData({ ...formData, target_title: e.target.value })}
                placeholder="Ví dụ: Trống đồng Ngọc Lũ"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Đường Dẫn Thực Hành
              </label>
              <input
                type="text"
                value={formData.target_url}
                onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                placeholder="/studio-3d/co-vat/dong_son_drum"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              Mô Tả Bối Cảnh & Mục Tiêu Nhiệm Vụ <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả tóm tắt những gì học sinh sẽ được học và khám phá trong nhiệm vụ này..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-normal text-slate-800 focus:outline-none focus:border-navy"
            />
          </div>

          {/* Checklist items */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-slate-700">
                Các Bước Trong Checklist Khám Phá <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddChecklist}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-navy hover:text-gold-dark"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm bước</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.checklist.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleChecklistChange(idx, e.target.value)}
                    placeholder={`Bước ${idx + 1}: Thao tác hoặc việc cần làm...`}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-navy"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(idx)}
                    disabled={formData.checklist.length <= 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reflection Prompt */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              Câu Hỏi Gợi Mở Thu Hoạch (Dành cho học sinh ghi nhận ký)
            </label>
            <input
              type="text"
              value={formData.reflection_prompt}
              onChange={(e) => setFormData({ ...formData, reflection_prompt: e.target.value })}
              placeholder="Ví dụ: Theo em, việc khắc họa hình ảnh chim Lạc và mặt trời ở tâm trống thể hiện điều gì...?"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-normal text-slate-800 focus:outline-none focus:border-navy"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-black text-xs transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : isEditing ? 'Cập Nhật Nhiệm Vụ' : 'Tạo Nhiệm Vụ'}
          </button>
        </div>
      </div>
    </div>
  );
}

