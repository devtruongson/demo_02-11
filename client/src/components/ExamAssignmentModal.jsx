import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle2, AlertCircle, Users, HelpCircle, Clock, Calendar,
  FileText, Search, Filter, Check, Award, Plus, Trash2, ArrowRight, BookOpen, Sparkles
} from 'lucide-react';

export default function ExamAssignmentModal({
  isOpen,
  assignment,
  onClose,
  onSave,
  authToken
}) {
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'students' | 'quizzes'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [dueDate, setDueDate] = useState('');
  
  // Student selection
  const [assignAll, setAssignAll] = useState(true);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  
  // Quiz question selection
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [quizSearch, setQuizSearch] = useState('');
  const [quizLessonFilter, setQuizLessonFilter] = useState('all');

  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      if (assignment) {
        setTitle(assignment.title || '');
        setDescription(assignment.description || '');
        setDurationMinutes(assignment.duration_minutes || 15);
        
        if (assignment.due_date) {
          const d = new Date(assignment.due_date);
          const formatted = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setDueDate(formatted);
        } else {
          setDueDate('');
        }

        const studentIds = assignment.assigned_student_ids || ['all'];
        if (Array.isArray(studentIds) && studentIds.includes('all')) {
          setAssignAll(true);
          setSelectedStudentIds([]);
        } else {
          setAssignAll(false);
          setSelectedStudentIds(Array.isArray(studentIds) ? studentIds.map(Number) : []);
        }

        setSelectedQuestionIds(Array.isArray(assignment.question_ids) ? assignment.question_ids.map(Number) : []);
      } else {
        setTitle('');
        setDescription('');
        setDurationMinutes(15);
        // Default due date: 7 days from now
        const defaultDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const formatted = new Date(defaultDue.getTime() - defaultDue.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setDueDate(formatted);
        setAssignAll(true);
        setSelectedStudentIds([]);
        setSelectedQuestionIds([]);
      }
      setActiveTab('info');
      setErrorMsg('');
    }
  }, [isOpen, assignment]);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const [studentsRes, quizzesRes] = await Promise.all([
        fetch('/api/users/students', { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch('/api/quizzes').then((r) => (r.ok ? r.json() : []))
      ]);
      setAllStudents(studentsRes);
      setAllQuizzes(quizzesRes);
    } catch (err) {
      console.error('Error loading students and quizzes:', err);
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  // Filter students
  const filteredStudents = allStudents.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      (s.full_name && s.full_name.toLowerCase().includes(q)) ||
      (s.username && s.username.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  // Filter quizzes
  const filteredQuizzes = allQuizzes.filter((q) => {
    const matchLesson = quizLessonFilter === 'all' || q.lesson === quizLessonFilter;
    if (!matchLesson) return false;
    if (!quizSearch.trim()) return true;
    const query = quizSearch.toLowerCase();
    return (
      (q.question && q.question.toLowerCase().includes(query)) ||
      (q.lesson && q.lesson.toLowerCase().includes(query))
    );
  });

  const uniqueLessons = Array.from(new Set(allQuizzes.map((q) => q.lesson))).filter(Boolean);

  // Student toggle handlers
  const handleToggleStudent = (id) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleSelectAllStudents = () => {
    setSelectedStudentIds(allStudents.map((s) => s.id));
  };

  const handleDeselectAllStudents = () => {
    setSelectedStudentIds([]);
  };

  // Quiz toggle handlers
  const handleToggleQuiz = (id) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((qid) => qid !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleSelectAllFilteredQuizzes = () => {
    const idsToAdd = filteredQuizzes.map((q) => q.id);
    const combined = Array.from(new Set([...selectedQuestionIds, ...idsToAdd]));
    setSelectedQuestionIds(combined);
  };

  const handleDeselectAllQuizzes = () => {
    setSelectedQuestionIds([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên bài kiểm tra / bài thi.');
      setActiveTab('info');
      return;
    }

    if (!assignAll && selectedStudentIds.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất 1 học sinh hoặc chọn "Giao cho toàn bộ học sinh".');
      setActiveTab('students');
      return;
    }

    if (selectedQuestionIds.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất 1 câu hỏi trắc nghiệm từ ngân hàng câu hỏi.');
      setActiveTab('quizzes');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        duration_minutes: Number(durationMinutes) || 15,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        assigned_student_ids: assignAll ? ['all'] : selectedStudentIds,
        question_ids: selectedQuestionIds
      };

      await onSave(payload, assignment?.id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi lưu bài kiểm tra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in text-slate-100">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] border-b border-amber-300/30 flex items-center justify-between gap-4 shrink-0 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 text-[#FDE2A7] border border-amber-300/40 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white font-serif-royal">
                {assignment ? 'Chỉnh Sửa Đề Thi & Bài Tập' : 'Tạo Đề Thi & Giao Bài Cho Học Sinh'}
              </h3>
              <p className="text-xs text-[#FFF7E8]/90">
                Lựa chọn câu hỏi trắc nghiệm từ ngân hàng chuẩn GDPT 2018 và phân công học sinh làm bài
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="relative z-10 p-2 rounded-xl text-[#FFF7E8]/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 bg-slate-950/50 border-b border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'info'
                ? 'border-gold text-gold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Thông tin chung</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'students'
                ? 'border-gold text-gold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Chọn học sinh giao bài</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-300">
              {assignAll ? 'Tất cả' : selectedStudentIds.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quizzes')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'quizzes'
                ? 'border-gold text-gold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Chọn câu hỏi Quizz</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              selectedQuestionIds.length > 0 ? 'bg-gold text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}>
              {selectedQuestionIds.length} câu
            </span>
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 text-rose-300 text-xs font-bold border border-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: THÔNG TIN CHUNG */}
            {activeTab === 'info' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Tên bài kiểm tra / Tiêu đề đề thi *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Kiểm tra 15 phút: Các nền văn minh cổ trên đất nước Việt Nam"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span>Thời gian làm bài (Phút) *</span>
                    </label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value={10}>10 phút (Kiểm tra đầu giờ)</option>
                      <option value={15}>15 phút (Kiểm tra thường xuyên)</option>
                      <option value={20}>20 phút</option>
                      <option value={30}>30 phút</option>
                      <option value={45}>45 phút (Kiểm tra 1 tiết)</option>
                      <option value={60}>60 phút</option>
                      <option value={90}>90 phút (Kiểm tra học kỳ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>Hạn nộp bài (Thời hạn hoàn thành)</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Mô tả & Lời dặn dò của giáo viên
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ví dụ: Học sinh đọc kỹ câu hỏi, mỗi câu chỉ có 1 đáp án đúng duy nhất. Nộp bài trước 23h59 Chủ Nhật."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold leading-relaxed"
                  />
                </div>

                {/* Quick Next Button */}
                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
                  >
                    <span>Tiếp tục: Chọn học sinh</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CHỌN HỌC SINH GIAO BÀI */}
            {activeTab === 'students' && (
              <div className="space-y-4">
                {/* Mode Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setAssignAll(true)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      assignAll
                        ? 'bg-gold/15 border-gold text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      assignAll ? 'border-gold bg-gold text-slate-950' : 'border-slate-600'
                    }`}>
                      {assignAll && <Check className="w-3 h-3 font-black stroke-[3]" />}
                    </div>
                    <div>
                      <strong className="block text-xs font-extrabold text-white">
                        Giao cho toàn bộ học sinh
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        Tất cả học sinh có tài khoản (kể cả học sinh đăng ký mới) đều sẽ nhận được bài thi
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setAssignAll(false)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      !assignAll
                        ? 'bg-gold/15 border-gold text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      !assignAll ? 'border-gold bg-gold text-slate-950' : 'border-slate-600'
                    }`}>
                      {!assignAll && <Check className="w-3 h-3 font-black stroke-[3]" />}
                    </div>
                    <div>
                      <strong className="block text-xs font-extrabold text-white">
                        Chỉ định học sinh cụ thể
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        Tích chọn danh sách học sinh cụ thể trong lớp học ({selectedStudentIds.length} đã chọn)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specific Student List */}
                {!assignAll && (
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          placeholder="Tìm học sinh theo họ tên, username hoặc email..."
                          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllStudents}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                        >
                          Chọn tất cả ({allStudents.length})
                        </button>
                        <button
                          type="button"
                          onClick={handleDeselectAllStudents}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold transition"
                        >
                          Bỏ chọn
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                      {filteredStudents.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-xs text-slate-500">
                          Không tìm thấy tài khoản học sinh nào phù hợp.
                        </div>
                      ) : (
                        filteredStudents.map((st) => {
                          const isSelected = selectedStudentIds.includes(st.id);
                          return (
                            <div
                              key={st.id}
                              onClick={() => handleToggleStudent(st.id)}
                              className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'bg-[#850B10]/80 border-amber-300/70 text-white shadow-sm'
                                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isSelected ? 'bg-gold text-slate-950' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {st.full_name ? st.full_name[0].toUpperCase() : 'H'}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-extrabold text-xs truncate text-white">
                                    {st.full_name || st.username}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate font-mono">
                                    @{st.username}
                                  </div>
                                </div>
                              </div>

                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-gold border-gold text-slate-950' : 'border-slate-700'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Next Button */}
                <div className="pt-3 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('quizzes')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
                  >
                    <span>Tiếp tục: Chọn câu hỏi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: CHỌN CÂU HỎI TỪ NGÂN HÀNG CÂU HỎI */}
            {activeTab === 'quizzes' && (
              <div className="space-y-4">
                {/* Filter and Actions Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={quizSearch}
                        onChange={(e) => setQuizSearch(e.target.value)}
                        placeholder="Tìm nội dung câu hỏi trắc nghiệm..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <select
                      value={quizLessonFilter}
                      onChange={(e) => setQuizLessonFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-gold max-w-xs truncate"
                    >
                      <option value="all">Tất cả bài học ({allQuizzes.length} câu)</option>
                      {uniqueLessons.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleSelectAllFilteredQuizzes}
                      className="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-amber-300 hover:text-slate-950 text-xs font-bold transition"
                    >
                      Chọn tất cả ({filteredQuizzes.length})
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllQuizzes}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold transition"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                {/* Quizzes List */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {filteredQuizzes.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500">
                      Không tìm thấy câu hỏi nào trong ngân hàng câu hỏi.
                    </div>
                  ) : (
                    filteredQuizzes.map((q, idx) => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;

                      const difficultyLabels = {
                        nhan_biet: { text: 'Nhận biết', color: 'bg-blue-950 text-blue-400 border-blue-800' },
                        thong_hieu: { text: 'Thông hiểu', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
                        van_dung: { text: 'Vận dụng', color: 'bg-amber-950 text-amber-400 border-amber-800' },
                        van_dung_cao: { text: 'Vận dụng cao', color: 'bg-rose-950 text-rose-400 border-rose-800' }
                      };
                      const diff = difficultyLabels[q.difficulty] || difficultyLabels.thong_hieu;

                      return (
                        <div
                          key={q.id}
                          onClick={() => handleToggleQuiz(q.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition space-y-2.5 ${
                            isSelected
                              ? 'bg-[#850B10]/70 border-amber-300/70 text-white shadow-md'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono font-bold text-gold">
                                Câu #{q.id}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${diff.color}`}>
                                {diff.text}
                              </span>
                              <span className="text-[11px] text-slate-400 line-clamp-1">
                                {q.lesson}
                              </span>
                            </div>

                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-gold border-gold text-slate-950' : 'border-slate-700'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                            {q.question}
                          </p>

                          {/* Options grid */}
                          {Array.isArray(parsedOptions) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs">
                              {parsedOptions.map((opt, optIdx) => (
                                <div
                                  key={optIdx}
                                  className={`px-3 py-1.5 rounded-xl border text-[11px] flex items-center gap-2 ${
                                    optIdx === q.correct_index
                                      ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300 font-bold'
                                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                                  }`}
                                >
                                  <span className="font-mono font-black text-slate-500">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <span className="truncate">{opt}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary & Action Controls */}
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-start">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold" />
                <span>Tổng: {selectedQuestionIds.length} câu</span>
              </span>
              <span>•</span>
              <span className="text-slate-300">
                {assignAll ? 'Tất cả học sinh' : `${selectedStudentIds.length} học sinh`}
              </span>
              <span>•</span>
              <span className="text-amber-300 font-mono">{durationMinutes} phút</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Đang phát hành...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{assignment ? 'Cập Nhật Đề Thi' : 'Phát Hành & Giao Bài'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

