import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Save, X, Sparkles, CheckCircle2, AlignLeft,
  BookOpen, Award, Layers, Hash
} from 'lucide-react';

export default function QuizEditorModal({
  quiz,
  isOpen,
  onClose,
  onSave,
  defaultLesson = '',
  defaultResourceId = null,
  allResources = []
}) {
  const [formData, setFormData] = useState({
    lesson: '',
    resource_id: '',
    topic_id: 4,
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct_index: 0,
    difficulty: 'thong_hieu',
    explanation: '',
    order_index: 1
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (quiz) {
      const opts = Array.isArray(quiz.options)
        ? quiz.options
        : (typeof quiz.options === 'string' ? JSON.parse(quiz.options || '[]') : []);

      setFormData({
        lesson: quiz.lesson || defaultLesson || '',
        resource_id: quiz.resource_id ? String(quiz.resource_id) : (defaultResourceId ? String(defaultResourceId) : ''),
        topic_id: quiz.topic_id || 4,
        question: quiz.question || '',
        optionA: opts[0] || '',
        optionB: opts[1] || '',
        optionC: opts[2] || '',
        optionD: opts[3] || '',
        correct_index: quiz.correct_index ?? 0,
        difficulty: quiz.difficulty || 'thong_hieu',
        explanation: quiz.explanation || '',
        order_index: quiz.order_index ?? 1
      });
    } else {
      setFormData({
        lesson: defaultLesson || 'Bài 11: Một số nền văn minh cổ trên đất nước Việt Nam',
        resource_id: defaultResourceId ? String(defaultResourceId) : '',
        topic_id: 4,
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correct_index: 0,
        difficulty: 'thong_hieu',
        explanation: '',
        order_index: 1
      });
    }
    setErrorMsg('');
  }, [quiz, defaultLesson, defaultResourceId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!formData.lesson.trim()) {
      setErrorMsg('Vui lòng nhập tên bài học.');
      return;
    }
    if (!formData.question.trim()) {
      setErrorMsg('Vui lòng nhập nội dung câu hỏi.');
      return;
    }
    if (
      !formData.optionA.trim() ||
      !formData.optionB.trim() ||
      !formData.optionC.trim() ||
      !formData.optionD.trim()
    ) {
      setErrorMsg('Vui lòng điền đủ cả 4 phương án lựa chọn (A, B, C, D).');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const optionsArray = [
        formData.optionA.trim(),
        formData.optionB.trim(),
        formData.optionC.trim(),
        formData.optionD.trim()
      ];

      const payload = {
        lesson: formData.lesson.trim(),
        resource_id: formData.resource_id ? Number(formData.resource_id) : null,
        topic_id: Number(formData.topic_id) || 4,
        question: formData.question.trim(),
        options: optionsArray,
        correct_index: Number(formData.correct_index) || 0,
        difficulty: formData.difficulty,
        explanation: formData.explanation.trim() || null,
        order_index: Number(formData.order_index) || 0
      };

      await onSave(payload, quiz?.id);
      onClose();
    } catch (err) {
      setErrorMsg('Lỗi khi lưu câu hỏi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentOptions = [
    formData.optionA || '(Phương án A)',
    formData.optionB || '(Phương án B)',
    formData.optionC || '(Phương án C)',
    formData.optionD || '(Phương án D)'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FFFDF5] rounded-3xl shadow-2xl border border-[#EBDBC5] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] text-white px-6 py-5 flex items-center justify-between border-b border-amber-300/30 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-amber-300/40 flex items-center justify-center text-[#FDE2A7]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FDE2A7]">
                {quiz ? 'Chỉnh Sửa Câu Hỏi Trắc Nghiệm' : 'Thêm Câu Hỏi Trắc Nghiệm Mới'}
              </span>
              <h3 className="text-lg font-bold text-white font-serif-royal">
                Ngân Hàng Trắc Nghiệm Năng Lực Theo Bài Học
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-2">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Lesson & Topic Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-600 font-bold mb-1">
                Tên Bài Học / Chuyên Đề Giảng Dạy <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lesson}
                onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
                placeholder="VD: Bài 11: Một số nền văn minh cổ trên đất nước Việt Nam"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">
                Chủ Đề (Topic ID)
              </label>
              <select
                value={formData.topic_id}
                onChange={(e) => setFormData({ ...formData, topic_id: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
              >
                <option value={1}>Chủ đề 1: Lịch sử và Sử học</option>
                <option value={2}>Chủ đề 2: Văn minh Ai Cập & Tây Á</option>
                <option value={3}>Chủ đề 3: Văn minh Ấn Độ & Trung Hoa</option>
                <option value={4}>Chủ đề 4: Văn minh Đông Nam Á</option>
                <option value={5}>Chủ đề 5: Văn minh trên đất nước Việt Nam</option>
                <option value={6}>Chủ đề 6: Di sản văn hóa</option>
                <option value={7}>Chủ đề 7: Cộng đồng ASEAN</option>
              </select>
            </div>
          </div>

          {/* Linked Resource & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-600 font-bold mb-1">
                Hiện vật / Tư liệu liên kết (Tùy chọn)
              </label>
              <select
                value={formData.resource_id}
                onChange={(e) => setFormData({ ...formData, resource_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
              >
                <option value="">-- Không gắn cố định với hiện vật cụ thể (Toàn bài) --</option>
                {allResources.map((r) => (
                  <option key={r.id} value={r.id}>
                    #{r.id} - {r.title} ({r.lesson})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">
                Mức Độ Nhận Thức (GDPT 2018)
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
              >
                <option value="nhan_biet">Cấp độ 1: Nhận biết</option>
                <option value="thong_hieu">Cấp độ 2: Thông hiểu</option>
                <option value="van_dung">Cấp độ 3: Vận dụng</option>
                <option value="van_dung_cao">Cấp độ 4: Vận dụng cao</option>
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              Nội dung câu hỏi trắc nghiệm <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="VD: Hình ảnh ngôi sao 14 cánh ở tâm mặt Trống đồng Ngọc Lũ biểu thị tín ngưỡng nào của cư dân Đông Sơn?"
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#850B10] leading-relaxed"
              required
            />
          </div>

          {/* 4 Options & Correct Answer Radio */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <label className="block text-slate-600 font-black uppercase tracking-wider text-[11px]">
              4 Phương Án Lựa Chọn & Chọn Đáp Án Đúng <span className="text-rose-500">*</span>
            </label>

            {[
              { letter: 'A', key: 'optionA', idx: 0 },
              { letter: 'B', key: 'optionB', idx: 1 },
              { letter: 'C', key: 'optionC', idx: 2 },
              { letter: 'D', key: 'optionD', idx: 3 }
            ].map(({ letter, key, idx }) => {
              const isCorrect = formData.correct_index === idx;
              return (
                <div key={letter} className="flex items-center gap-3">
                  <label
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer border transition shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white font-black border-emerald-600 shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={isCorrect}
                      onChange={() => setFormData({ ...formData, correct_index: idx })}
                      className="sr-only"
                    />
                    <span>{letter}</span>
                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
                  </label>

                  <input
                    type="text"
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={`Nội dung phương án ${letter}...`}
                    className={`flex-1 px-3.5 py-2 rounded-xl bg-white border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#850B10] ${
                      isCorrect ? 'border-emerald-300 ring-1 ring-emerald-200 text-slate-900 font-bold' : 'border-slate-200 text-slate-800'
                    }`}
                    required
                  />
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              Giải thích chi tiết & Giải mã sử liệu (Hiển thị khi học sinh trả lời)
            </label>
            <textarea
              rows={3}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="VD: Ngôi sao 14 cánh ở trung tâm tượng trưng cho Mặt Trời - nguồn năng lượng đem lại sự sinh sôi cho vạn vật trong nền nông nghiệp lúa nước..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10] leading-relaxed"
            />
          </div>

          {/* Order Index */}
          <div className="w-48">
            <label className="block text-slate-600 font-bold mb-1">
              Thứ tự câu hỏi trong bài
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
            />
          </div>

          {/* Live Preview Card */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Xem trước câu hỏi (Live Preview)
            </span>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">
                {formData.question || '(Chưa nhập nội dung câu hỏi)'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentOptions.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                      formData.correct_index === i
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                    {formData.correct_index === i && <span className="ml-auto text-[10px] text-emerald-600 font-black">✓ Đúng</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
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
            <span>{saving ? 'Đang lưu...' : quiz ? 'Cập nhật câu hỏi' : 'Lưu câu hỏi mới'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

