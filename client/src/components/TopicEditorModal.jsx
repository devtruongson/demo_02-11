import {
  AlertCircle, Compass, Link as LinkIcon, RefreshCw, Upload, X,
  Sparkles, CheckCircle2, Image as ImageIcon, HelpCircle
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    img: '',
    game_image: '',
    game_quiz_ids: [null, null, null, null]
  });

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGameImg, setUploadingGameImg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [allQuizzes, setAllQuizzes] = useState([]);

  const coverFileInputRef = useRef(null);
  const gameFileInputRef = useRef(null);

  // Load available quizzes for game configuration
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/quizzes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllQuizzes(data);
      })
      .catch((err) => console.warn('Fetch quizzes error in TopicEditorModal:', err));
  }, [isOpen]);

  useEffect(() => {
    if (topic) {
      let initialGameQuizIds = [null, null, null, null];
      if (Array.isArray(topic.game_quiz_ids)) {
        initialGameQuizIds = topic.game_quiz_ids;
      } else if (typeof topic.game_quiz_ids === 'string') {
        try {
          initialGameQuizIds = JSON.parse(topic.game_quiz_ids);
        } catch {}
      }
      while (initialGameQuizIds.length < 4) initialGameQuizIds.push(null);

      setFormData({
        title: topic.title || '',
        description: topic.description || '',
        img: topic.img || '',
        game_image: topic.game_image || '',
        game_quiz_ids: initialGameQuizIds
      });
    } else {
      setFormData({
        title: '',
        description: '',
        img: '',
        game_image: '',
        game_quiz_ids: [null, null, null, null]
      });
    }
    setErrorMsg('');
  }, [topic, isOpen]);

  if (!isOpen) return null;

  // 1. Upload Cover Image (Ảnh bìa chủ đề)
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn tệp định dạng ảnh (JPG, PNG, WebP).');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setUploadingCover(true);
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
      setUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  // 2. Upload Secret Game Image (Ảnh bí ẩn lật ô) - User specifically requested to upload any custom image!
  const handleGameImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn tệp định dạng ảnh (JPG, PNG, WebP) cho trò chơi.');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setUploadingGameImg(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/upload/single', {
        method: 'POST',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        body: uploadFormData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi tải ảnh trò chơi lên');
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, game_image: data.url }));
    } catch (err) {
      setErrorMsg('Tải ảnh trò chơi thất bại: ' + err.message);
    } finally {
      setUploadingGameImg(false);
      if (gameFileInputRef.current) gameFileInputRef.current.value = '';
    }
  };

  // 3. Auto-assign 4 quizzes belonging to this topic
  const handleAutoAssignQuizzes = () => {
    if (allQuizzes.length === 0) {
      alert('Chưa có danh sách câu hỏi trắc nghiệm nào trong cơ sở dữ liệu.');
      return;
    }

    const topicIdNum = topic?.id ? Number(topic.id) : null;
    let matching = allQuizzes.filter((q) => topicIdNum && q.topic_id === topicIdNum);

    // If not enough by topic_id, pick any from all quizzes
    const pool = matching.length >= 4 ? matching : allQuizzes;
    const selected = pool.slice(0, 4).map((q) => q.id);

    setFormData((prev) => ({
      ...prev,
      game_quiz_ids: selected,
      game_image: prev.game_image || prev.img
    }));
  };

  // 4. Set quiz for a specific slot (0, 1, 2, 3)
  const handleSetSlotQuiz = (slotIndex, quizId) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.game_quiz_ids) ? [...prev.game_quiz_ids] : [null, null, null, null];
      while (current.length < 4) current.push(null);
      current[slotIndex] = quizId ? Number(quizId) : null;
      return {
        ...prev,
        game_quiz_ids: current
      };
    });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in !m-0">
      <div className="bg-white rounded-3xl pt-4 w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#850B10] text-white flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {topic ? `Chỉnh Sửa & Cấu Hình Chủ Đề #${topic.id}` : 'Thêm Chủ Đề Học Tập Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Cập nhật thông tin chủ đề và cấu hình trò chơi lật 4 ô chữ khám phá bức tranh bí ẩn.
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= PHẦN 1: THÔNG TIN CƠ BẢN CHỦ ĐỀ ================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-[#850B10]" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                1. Thông tin chung của Chủ Đề
              </h4>
            </div>

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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#850B10]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Mô tả tóm tắt nội dung chủ đề
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn gọn về phạm vi kiến thức của chủ đề trong chương trình Lịch sử 10..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#850B10] leading-relaxed resize-y"
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
                  ref={coverFileInputRef}
                  onChange={handleCoverUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition shrink-0 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingCover ? 'Đang tải...' : 'Tải ảnh từ máy'}</span>
                </button>

                <div className="relative flex-1">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="Hoặc dán URL ảnh bìa (https://...)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                  />
                </div>
              </div>

              {formData.img && (
                <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mt-2">
                  <img
                    src={formData.img}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ================= PHẦN 2: CẤU HÌNH TRÒ CHƠI LẬT Ô CHỮ CHO CHỦ ĐỀ ================= */}
          <div className="bg-amber-50/70 p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#850B10] text-white flex items-center justify-center font-black shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>Trò Chơi: Lật Ô Chữ Khám Phá Ảnh Bí Ẩn</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#850B10] text-[#FFFDF8]">
                      4 Ô Chữ
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Cấu hình bức tranh bí ẩn và 4 câu hỏi trắc nghiệm tương ứng cho 4 ô số 01, 02, 03, 04 của chủ đề này.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoAssignQuizzes}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Tự động gán 4 câu hỏi thuộc chủ đề</span>
              </button>
            </div>

            {/* Secret Game Image Upload & URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Hình ảnh bí ẩn sau 4 ô lật (Game Secret Image)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-8 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={gameFileInputRef}
                      onChange={handleGameImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => gameFileInputRef.current?.click()}
                      disabled={uploadingGameImg}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingGameImg ? 'Đang tải ảnh lên...' : 'Tải ảnh bí ẩn từ máy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, game_image: formData.img })}
                      className="px-3 py-2 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-slate-800 text-xs font-bold transition"
                    >
                      Dùng ảnh bìa chủ đề
                    </button>
                  </div>

                  <div className="relative">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.game_image || ''}
                      onChange={(e) => setFormData({ ...formData, game_image: e.target.value })}
                      placeholder="Hoặc dán URL ảnh bí ẩn (https://...)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#850B10] bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    Khi học sinh trả lời đúng các ô chữ 01, 02, 03, 04, các mảnh ghép sẽ lật mở để lộ bức ảnh này.
                  </p>
                </div>

                <div className="md:col-span-4 flex items-center justify-center">
                  <div className="relative w-full h-28 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-300 shadow-md">
                    <img
                      src={formData.game_image || formData.img || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                      alt="Secret Game Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#850B10] text-[#FFF7E8] text-[9px] font-black uppercase tracking-wider shadow-xs">
                      Ảnh Bí Ẩn
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Question Slots Grid */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                4 Câu hỏi trắc nghiệm tương ứng cho 4 ô lật:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const tileNumber = `0${slotIdx + 1}`;
                  const selectedId = formData.game_quiz_ids?.[slotIdx] || null;
                  const selectedQuiz = allQuizzes.find((q) => q.id === Number(selectedId));

                  return (
                    <div
                      key={slotIdx}
                      className="p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs flex flex-col justify-between space-y-2.5"
                    >
                      <div>
                        {/* Slot Header */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-lg bg-[#850B10] text-white">
                            Ô {tileNumber}
                          </span>
                          {selectedQuiz ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> #{selectedQuiz.id}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400">Chưa gán</span>
                          )}
                        </div>

                        {/* Dropdown */}
                        <div className="mt-2 space-y-1">
                          <label className="block text-[10px] font-bold text-slate-700">
                            Chọn câu hỏi:
                          </label>
                          <select
                            value={selectedId || ''}
                            onChange={(e) => handleSetSlotQuiz(slotIdx, e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                          >
                            <option value="">-- Chọn câu hỏi từ CSDL --</option>
                            {allQuizzes.map((q) => (
                              <option key={q.id} value={q.id}>
                                [#{q.id}] {q.question.substring(0, 50)}...
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Selected Question Preview */}
                        {selectedQuiz && (
                          <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-[10px] space-y-1 text-slate-700">
                            <p className="font-bold line-clamp-2 text-slate-900">{selectedQuiz.question}</p>
                            <p className="text-[9px] text-emerald-700 font-semibold truncate">
                              ✓ Đáp án: {selectedQuiz.options?.[selectedQuiz.correct_index] || 'N/A'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Clear button */}
                      {selectedId && (
                        <button
                          type="button"
                          onClick={() => handleSetSlotQuiz(slotIdx, null)}
                          className="text-[10px] font-bold text-rose-600 hover:underline self-end"
                        >
                          Xóa lựa chọn
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
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
              className="px-6 py-2.5 rounded-xl bg-[#850B10] hover:bg-[#70070B] text-white text-xs font-bold transition shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{topic ? 'Lưu thay đổi chủ đề & trò chơi' : 'Tạo chủ đề & lưu trò chơi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
