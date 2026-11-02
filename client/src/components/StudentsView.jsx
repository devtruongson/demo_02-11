import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Users, Award, CheckCircle, CheckCircle2, HelpCircle, BookOpen, Sparkles, Box, Compass,
  ArrowRight, Filter, ShieldCheck, PlusCircle, RefreshCw, Eye, CheckSquare, ChevronDown,
  ChevronUp, Copy, Check, Star, Zap, Target, Flame, Edit3, Trash2, RotateCcw, Lightbulb
} from 'lucide-react';
import QuizInteractiveComponent from './QuizInteractiveComponent.jsx';
import QuizEditorModal from './QuizEditorModal.jsx';
import StudentTaskEditorModal from './StudentTaskEditorModal.jsx';

export default function StudentsView({ currentUser, authToken }) {
  const { tab = 'nhiem-vu' } = useParams();
  const navigate = useNavigate();

  const studentTabs = [
    { to: '/hoc-sinh/nhiem-vu', id: 'nhiem-vu', label: 'Nhiệm Vụ Học Tập & Phương Pháp', icon: BookOpen },
    { to: '/hoc-sinh/luyen-tap-trac-nghiem', id: 'luyen-tap-trac-nghiem', label: 'Thử Thách Trắc Nghiệm Từng Bài', icon: Award },
  ];

  const isAdmin = currentUser?.role === 'admin';

  // ==========================================
  // TAB 1: METHOD STEPS & QUESTS STATE
  // ==========================================
  const [activeMethodStep, setActiveMethodStep] = useState(0);

  // Student Tasks State
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskLessonFilter, setTaskLessonFilter] = useState('all');

  // Task Progress & Notes saved in localStorage
  const [taskProgress, setTaskProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('sukyso_tasks_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Admin Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Temporary UX feedback
  const [copiedTaskId, setCopiedTaskId] = useState(null);
  const [savedNoteTaskId, setSavedNoteTaskId] = useState(null);

  // ==========================================
  // TAB 2: QUIZZES STATE
  // ==========================================
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  // Admin Quiz Modal
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Fetch student tasks
  const fetchTasks = async (lesson = taskLessonFilter) => {
    setLoadingTasks(true);
    try {
      const url = lesson && lesson !== 'all'
        ? `/api/student-tasks?lesson=${encodeURIComponent(lesson)}&_t=${Date.now()}`
        : `/api/student-tasks?_t=${Date.now()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Lỗi nạp nhiệm vụ học tập:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Fetch distinct lessons for quizzes
  const fetchLessons = async () => {
    try {
      const res = await fetch(`/api/quizzes/lessons?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data);
      }
    } catch (err) {
      console.error('Lỗi nạp danh sách bài học:', err);
    }
  };

  // Fetch quizzes
  const fetchQuizzes = async (lessonName = selectedLesson) => {
    setLoadingQuizzes(true);
    try {
      const url = lessonName && lessonName !== 'all'
        ? `/api/quizzes?lesson=${encodeURIComponent(lessonName)}&_t=${Date.now()}`
        : `/api/quizzes?_t=${Date.now()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (err) {
      console.error('Lỗi nạp câu hỏi trắc nghiệm:', err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    fetchTasks(taskLessonFilter);
    fetchLessons();
  }, []);

  useEffect(() => {
    fetchTasks(taskLessonFilter);
  }, [taskLessonFilter]);

  useEffect(() => {
    fetchQuizzes(selectedLesson);
  }, [selectedLesson]);

  // Checklist toggle
  const toggleTaskCheck = (taskId, checkIndex) => {
    setTaskProgress((prev) => {
      const current = prev[taskId] || { checks: [], note: '' };
      const currentChecks = current.checks || [];
      const isChecked = currentChecks.includes(checkIndex);
      const newChecks = isChecked
        ? currentChecks.filter((i) => i !== checkIndex)
        : [...currentChecks, checkIndex];

      const next = {
        ...prev,
        [taskId]: {
          ...current,
          checks: newChecks
        }
      };
      try {
        localStorage.setItem('sukyso_tasks_progress', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Note change
  const handleNoteChange = (taskId, noteText) => {
    setTaskProgress((prev) => {
      const current = prev[taskId] || { checks: [], note: '' };
      const next = {
        ...prev,
        [taskId]: {
          ...current,
          note: noteText
        }
      };
      try {
        localStorage.setItem('sukyso_tasks_progress', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSaveNote = (taskId) => {
    setSavedNoteTaskId(taskId);
    setTimeout(() => setSavedNoteTaskId(null), 2500);
  };

  // Reset all student progress
  const handleResetProgress = () => {
    if (window.confirm('Em có chắc chắn muốn đặt lại toàn bộ tiến độ nhiệm vụ đã làm không?')) {
      setTaskProgress({});
      try {
        localStorage.removeItem('sukyso_tasks_progress');
      } catch {}
    }
  };

  // Copy task submission to clipboard
  const handleCopySubmission = (task) => {
    const progress = taskProgress[task.id] || { checks: [], note: '' };
    const checklist = Array.isArray(task.checklist) ? task.checklist : [];
    const completedCount = progress.checks?.length || 0;
    const note = progress.note || '(Chưa có ghi chép)';

    const text = `=== BÀI NỘP NHIỆM VỤ LỊCH SỬ 10 ===\n` +
      `Học sinh: ${currentUser?.full_name || 'Học sinh Sử Ký Số'}\n` +
      `Nhiệm vụ: ${task.title}\n` +
      `Bài học: ${task.lesson}\n` +
      `Tiến độ: ${completedCount}/${checklist.length} tiêu chí hoàn thành (${Math.round((completedCount / (checklist.length || 1)) * 100)}%)\n\n` +
      `* Ghi chép & Thu hoạch của em:\n${note}\n\n` +
      `--- Nền tảng Sử Ký Số GDPT 2018 ---`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedTaskId(task.id);
      setTimeout(() => setCopiedTaskId(null), 2500);
    });
  };

  // Admin Task Actions
  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (t) => {
    setEditingTask(t);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (payload, id) => {
    const url = id ? `/api/student-tasks/${id}` : '/api/student-tasks';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu nhiệm vụ học tập');
    }
    await fetchTasks(taskLessonFilter);
  };

  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhiệm vụ "${title}"?`)) return;
    try {
      const res = await fetch(`/api/student-tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi xóa nhiệm vụ');
      }
      await fetchTasks(taskLessonFilter);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Admin Quiz Actions
  const handleOpenAddQuiz = () => {
    setEditingQuiz(null);
    setIsQuizModalOpen(true);
  };

  const handleOpenEditQuiz = (q) => {
    setEditingQuiz(q);
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = async (payload, id) => {
    const url = id ? `/api/quizzes/${id}` : '/api/quizzes';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu câu hỏi');
    }
    await fetchLessons();
    await fetchQuizzes(selectedLesson);
  };

  const handleDeleteQuiz = async (id, question) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi "${question}"?`)) return;
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi xóa câu hỏi');
      }
      await fetchLessons();
      await fetchQuizzes(selectedLesson);
    } catch (err) {
      alert('Xóa câu hỏi thất bại: ' + err.message);
    }
  };

  // Compute student quest statistics
  const totalTasksCount = tasks.length;
  let completedTasksCount = 0;
  let totalXPEarned = 0;
  let totalPossibleXP = 0;

  tasks.forEach((t) => {
    totalPossibleXP += (t.reward_xp || 100);
    const checks = taskProgress[t.id]?.checks || [];
    const checklist = Array.isArray(t.checklist) ? t.checklist : [];
    if (checklist.length > 0 && checks.length === checklist.length) {
      completedTasksCount += 1;
      totalXPEarned += (t.reward_xp || 100);
    } else if (checklist.length > 0 && checks.length > 0) {
      totalXPEarned += Math.round(((t.reward_xp || 100) * checks.length) / checklist.length);
    }
  });

  const studentRank = totalXPEarned >= 400
    ? { title: 'Chuyên Gia Di Sản Số', badge: '🥇 Cấp Cao', color: 'text-amber-500' }
    : totalXPEarned >= 150
    ? { title: 'Nhà Khảo Cổ Trẻ', badge: '🥈 Trung Cấp', color: 'text-sky-500' }
    : { title: 'Học Sinh Tập Sự', badge: '🥉 Khởi Động', color: 'text-emerald-500' };

  // 3 Method Steps definition
  const methodSteps = [
    {
      step: '01',
      title: 'Quan Sát Chi Tiết 3D',
      subtitle: 'Xoay 360°, bóc tách hoa văn & đo đạc khảo cổ',
      color: 'blue',
      guide: [
        'Dùng ngón tay hoặc chuột kéo xoay 360 độ đa chiều để bao quát dáng vẻ hiện vật.',
        'Nhấn đúp hoặc dùng con lăn cuộn chuột để phóng to quan sát các hoa văn chạm khắc tinh xảo.',
        'Chuyển đổi các góc ánh sáng (Ánh sáng Bảo tàng, Chiếu thẳng, Ánh sáng xiên) để làm nổi bật nét khắc mờ.',
        'Bật thước đo tỷ lệ khảo cổ để đối chiếu kích thước thực tế so với trang sách giáo khoa.'
      ],
      sampleTitle: 'Thực hành ngay với Trống đồng Ngọc Lũ 3D',
      sampleUrl: '/studio-3d/co-vat/dong_son_drum',
      sampleIcon: Box
    },
    {
      step: '02',
      title: 'Đọc Bối Cảnh Lịch Sử',
      subtitle: 'Tra cứu niên đại, xuất xứ & ý nghĩa văn minh',
      color: 'emerald',
      guide: [
        'Nắm vững niên đại hình thành và thời kỳ lịch sử tương ứng trong chương trình Lịch sử 10.',
        'Xác định tọa độ phát hiện khảo cổ học và bảo tàng lưu giữ hiện vật nguyên bản.',
        'Đọc bản dịch văn bia (nếu là bia đá chữ Phạn cổ) để hiểu tư tưởng tôn giáo và chính trị đương thời.',
        'Đối chiếu với các đoạn tư liệu viết trong SGK Kết nối tri thức, Cánh Diều hoặc Chân trời sáng tạo.'
      ],
      sampleTitle: 'Khám phá Tư liệu Văn minh Đông Nam Á',
      sampleUrl: '/kho-tu-lieu?topic=4',
      sampleIcon: Compass
    },
    {
      step: '03',
      title: 'Thử Thách & Đối Chiếu',
      subtitle: 'Làm trắc nghiệm, phản biện & ghi chép thu hoạch',
      color: 'amber',
      guide: [
        'Vào tab Đấu Trường Trắc Nghiệm để làm các câu hỏi trắc nghiệm phân hóa theo bài học.',
        'Tự đặt câu hỏi phản biện: Hiện vật phản ánh đời sống vật chất hay tâm linh của tổ tiên ta?',
        'Điền cảm nhận và câu trả lời vào ô "Nhật ký thu hoạch của em" bên dưới mỗi nhiệm vụ.',
        'Bấm "Sao chép bài nộp" để nộp báo cáo thu hoạch cho giáo viên bộ môn qua Zalo hoặc Google Classroom.'
      ],
      sampleTitle: 'Vào Đấu Trường Trắc Nghiệm Ngay',
      sampleUrl: '/hoc-sinh/luyen-tap-trac-nghiem',
      sampleIcon: Award
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-navy-dark via-navy to-[#223968] text-white p-5 sm:p-8 rounded-3xl shadow-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold/20 text-gold-light border border-gold/30 mb-3">
            <Users className="w-4 h-4" /> Góc Tự Học & Khám Phá Của Học Sinh
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Khám Phá Lịch Sử 10 Trực Quan & Thú Vị
          </h2>
          <p className="mt-2 text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
            Không còn những trang sách khô khan. Tự mình tương tác với các cổ vật 3D, hoàn thành nhiệm vụ thu hoạch và thử thách kiến thức qua đấu trường trắc nghiệm chuẩn GDPT 2018.
          </p>

          {/* Sub-Tab Navigation with Slugs */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-white/15">
            {studentTabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <NavLink
                  key={t.to}
                  to={t.to}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-gold text-slate-950 shadow-md font-black'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{t.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0 relative z-10">
          <Link
            to="/studio-3d"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gold hover:bg-gold-dark text-slate-950 font-black text-xs transition shadow active:scale-95 text-center"
          >
            <Box className="w-4 h-4" />
            <span>Mở Studio 3D Ngay</span>
          </Link>
          <Link
            to="/kho-tu-lieu"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 text-center"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tra Cứu Kho Tư Liệu</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: NHIỆM VỤ HỌC TẬP & PHƯƠNG PHÁP                     */}
      {/* ========================================================= */}
      {tab === 'nhiem-vu' && (
        <div className="space-y-6 sm:space-y-8">
          {/* SECTION 1: INTERACTIVE 3-STEP METHOD */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold inline-block animate-ping" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-gold-dark">
                    Quy Trình Rèn Luyện Năng Lực Sư Phạm
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  Phương Pháp Khai Thác Tư Liệu Số Dành Cho Học Sinh Lớp 10
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Nhấn vào từng bước bên dưới để xem hướng dẫn & thực hành
              </span>
            </div>

            {/* 3 Clickable Method Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {methodSteps.map((s, idx) => {
                const isSelected = activeMethodStep === idx;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveMethodStep(idx)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/70 border-gold shadow-md ring-2 ring-gold/40'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`w-8 h-8 rounded-xl font-black flex items-center justify-center text-xs transition ${
                            isSelected
                              ? 'bg-navy text-gold shadow-sm scale-110'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                          }`}
                        >
                          {s.step}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gold text-slate-950 uppercase tracking-wider">
                            Đang xem
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-sm text-slate-900 group-hover:text-navy transition">
                        {s.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {s.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <span className={isSelected ? 'text-navy font-black' : 'text-slate-400'}>
                        {isSelected ? '✓ Đang kích hoạt' : 'Bấm để mở chi tiết'}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-gold-dark' : 'text-slate-400 group-hover:translate-x-1'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expanded Active Step Detail Panel */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/40 border border-amber-200/60 shadow-xs space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-navy text-gold flex items-center justify-center font-black text-sm shadow">
                    {methodSteps[activeMethodStep].step}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      Hướng Dẫn Thao Tác: {methodSteps[activeMethodStep].title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {methodSteps[activeMethodStep].subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Action Link for this step */}
                  {(() => {
                    const SampleIcon = methodSteps[activeMethodStep].sampleIcon;
                    return (
                      <Link
                        to={methodSteps[activeMethodStep].sampleUrl}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition shadow-sm active:scale-95"
                      >
                        <SampleIcon className="w-4 h-4 text-gold" />
                        <span>{methodSteps[activeMethodStep].sampleTitle}</span>
                      </Link>
                    );
                  })()}
                </div>
              </div>

              {/* Step Checklist/Guidance Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {methodSteps[activeMethodStep].guide.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {g}
                    </p>
                  </div>
                ))}
              </div>

              {/* Next Step Button */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Bước {activeMethodStep + 1} trên 3 phương pháp rèn luyện
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMethodStep((prev) => (prev + 1) % 3)}
                  className="font-bold text-navy hover:text-gold-dark transition flex items-center gap-1"
                >
                  <span>Chuyển sang Bước {((activeMethodStep + 1) % 3) + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: STUDENT QUEST ARENA (NHIỆM VỤ HỌC TẬP THỰC TẾ) */}
          <div className="space-y-6">
            {/* Quest Header & Progress Dashboard */}
            <div className="bg-gradient-to-br from-slate-900 via-navy-dark to-[#162747] text-white p-5 sm:p-7 rounded-3xl border border-white/10 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gold" />
                    <span className="text-xs font-black uppercase tracking-wider text-gold-light">
                      Hệ Thống Nhiệm Vụ Khám Phá Lịch Sử 10
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Bảng Nhiệm Vụ & Nhật Ký Thu Hoạch Của Học Sinh
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    Hoàn thành các tiêu chí khám phá hiện vật, thu thập điểm kinh nghiệm (XP) và ghi lại những phát hiện lịch sử của riêng em.
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={handleOpenAddTask}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-black text-xs transition shadow-sm active:scale-95 shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Thêm nhiệm vụ mới</span>
                  </button>
                )}
              </div>

              {/* Progress & Ranking Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Metric 1 */}
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Tiến độ nhiệm vụ</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <strong className="text-2xl font-black text-white">
                      {completedTasksCount} / {totalTasksCount}
                    </strong>
                    <span className="text-xs text-emerald-400 font-bold">
                      ({totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0}%)
                    </span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="w-full bg-white/20 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Điểm kinh nghiệm (XP)</span>
                    <Zap className="w-4 h-4 text-gold" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <strong className="text-2xl font-black text-gold">
                      {totalXPEarned}
                    </strong>
                    <span className="text-xs text-slate-300 font-medium">/ {totalPossibleXP} XP</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Tích lũy qua từng tiêu chí
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300 font-medium block">Danh hiệu học tập</span>
                    <h5 className={`text-base font-black mt-1 ${studentRank.color}`}>
                      {studentRank.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {studentRank.badge}
                    </span>
                  </div>
                  <button
                    onClick={handleResetProgress}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
                    title="Đặt lại tiến độ làm bài"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter by Lesson */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Lọc theo bài học:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setTaskLessonFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    taskLessonFilter === 'all'
                      ? 'bg-navy text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả bài học ({tasks.length})
                </button>
                {Array.from(new Set(tasks.map((t) => t.lesson))).map((les) => (
                  <button
                    key={les}
                    onClick={() => setTaskLessonFilter(les)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      taskLessonFilter === les
                        ? 'bg-navy text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {les.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Cards List */}
            {loadingTasks ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Đang tải danh sách nhiệm vụ học tập...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-2">
                <Target className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-600">Chưa có nhiệm vụ học tập nào phù hợp.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => {
                  const progress = taskProgress[task.id] || { checks: [], note: '' };
                  const checklist = Array.isArray(task.checklist) ? task.checklist : [];
                  const completedChecks = progress.checks || [];
                  const isFullyCompleted = checklist.length > 0 && completedChecks.length === checklist.length;
                  const completionPercent = checklist.length > 0 ? Math.round((completedChecks.length / checklist.length) * 100) : 0;

                  return (
                    <div
                      key={task.id}
                      className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden ${
                        isFullyCompleted
                          ? 'border-emerald-300/80 ring-1 ring-emerald-300/40 bg-emerald-50/20'
                          : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Task Header */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold/20 text-gold-dark border border-gold/40">
                              {task.badge || 'Khám Phá Di Sản'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-bold">
                              • {task.lesson}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              {task.difficulty === 'co_ban' ? 'Cơ bản' : task.difficulty === 'van_dung' ? 'Vận dụng' : 'Thông hiểu'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-black text-xs">
                              <Zap className="w-3.5 h-3.5 text-amber-600" />
                              +{task.reward_xp || 100} XP
                            </span>

                            {isAdmin && (
                              <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                                <button
                                  onClick={() => handleOpenEditTask(task)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100"
                                  title="Sửa nhiệm vụ"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id, task.title)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="Xóa nhiệm vụ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Task Title & Description */}
                        <div>
                          <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                            {task.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                            {task.description}
                          </p>
                        </div>

                        {/* Interactive Checklist Header & Progress Bar */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5 text-navy" />
                              Tiêu chí hoàn thành ({completedChecks.length}/{checklist.length}):
                            </span>
                            <span className={`font-black text-xs ${isFullyCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {isFullyCompleted ? '🎉 Đã hoàn thành' : `${completionPercent}%`}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${isFullyCompleted ? 'bg-emerald-500' : 'bg-gold'}`}
                              style={{ width: `${completionPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Interactive Checkbox Items */}
                        <div className="space-y-2 pt-1">
                          {checklist.map((step, idx) => {
                            const isChecked = completedChecks.includes(idx);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleTaskCheck(task.id, idx)}
                                className={`w-full text-left p-3 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                                  isChecked
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                                    : 'bg-slate-50/80 hover:bg-slate-100/70 border-slate-200/80 text-slate-700'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition ${
                                    isChecked
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <span className={`text-xs leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                                  {step}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Student Field Notebook (Nhật ký thu hoạch) */}
                        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2.5 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                              Nhật Ký Thu Hoạch Của Em:
                            </span>
                            {savedNoteTaskId === task.id && (
                              <span className="text-[11px] font-bold text-emerald-600 animate-fade-in flex items-center gap-1">
                                <Check className="w-3 h-3" /> Đã lưu vào bộ nhớ
                              </span>
                            )}
                          </div>

                          {task.reflection_prompt && (
                            <p className="text-[11px] text-amber-800 italic leading-relaxed">
                              💡 Gợi ý: {task.reflection_prompt}
                            </p>
                          )}

                          <textarea
                            rows={3}
                            value={progress.note || ''}
                            onChange={(e) => handleNoteChange(task.id, e.target.value)}
                            placeholder="Ghi lại các chi tiết lịch sử, nhận xét hoặc cảm nhận của em sau khi quan sát hiện vật..."
                            className="w-full p-3 rounded-xl border border-amber-200/80 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-navy"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveNote(task.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-xs"
                            >
                              Lưu ghi chép
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopySubmission(task)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
                            >
                              {copiedTaskId === task.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Đã sao chép bài nộp!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Sao chép bài nộp cho thầy/cô</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Action Buttons to launch 3D Artifact or Resource */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs text-slate-500 font-medium">
                            Đối tượng: <strong className="text-slate-800">{task.target_title || 'Mô hình 3D'}</strong>
                          </span>

                          <Link
                            to={task.target_url || '/studio-3d'}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-black transition shadow-sm active:scale-95 ml-auto"
                          >
                            <Box className="w-4 h-4 text-gold" />
                            <span>Bắt đầu nhiệm vụ tại {task.target_type === '3d' ? 'Studio 3D' : task.target_type === 'quiz' ? 'Đấu trường' : 'Kho tư liệu'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: THỬ THÁCH TRẮC NGHIỆM TỪNG BÀI                     */}
      {/* ========================================================= */}
      {tab === 'luyen-tap-trac-nghiem' && (
        <div className="space-y-6">
          {/* Lesson Filter & Header */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                  Đấu Trường Trắc Nghiệm GDPT 2018
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Luyện Tập & Củng Cố Kiến Thức Từng Bài Học
                </h3>
              </div>

              {isAdmin && (
                <button
                  onClick={handleOpenAddQuiz}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-black text-xs transition shadow-sm active:scale-95 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm câu hỏi mới</span>
                </button>
              )}
            </div>

            {/* Lesson Selector Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                Chọn Bài Học / Chuyên Đề Cần Ôn Tập:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedLesson('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedLesson === 'all'
                      ? 'bg-navy text-white shadow-sm ring-1 ring-gold/40 font-black'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  🌟 Tất cả các bài ({quizzes.length})
                </button>

                {lessons.map((les) => (
                  <button
                    key={les.lesson}
                    onClick={() => setSelectedLesson(les.lesson)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedLesson === les.lesson
                        ? 'bg-navy text-white shadow-sm ring-1 ring-gold/40 font-black'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{les.lesson}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gold/20 text-gold-dark font-black">
                      {les.question_count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Quiz Player */}
          {loadingQuizzes ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-2">
              <RefreshCw className="w-5 h-5 text-gold animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500">Đang tải bộ câu hỏi của bài học...</p>
            </div>
          ) : (
            <QuizInteractiveComponent
              quizzes={quizzes}
              lessonTitle={selectedLesson !== 'all' ? selectedLesson : 'Toàn bộ chương trình Lịch sử 10'}
              isAdmin={isAdmin}
              onEditQuiz={handleOpenEditQuiz}
              onDeleteQuiz={handleDeleteQuiz}
              onAddQuiz={handleOpenAddQuiz}
              onRefresh={() => fetchQuizzes(selectedLesson)}
            />
          )}
        </div>
      )}

      {/* Quiz Editor Modal */}
      <QuizEditorModal
        quiz={editingQuiz}
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setEditingQuiz(null);
        }}
        onSave={handleSaveQuiz}
        defaultLesson={selectedLesson !== 'all' ? selectedLesson : ''}
      />

      {/* Student Task Editor Modal */}
      <StudentTaskEditorModal
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
}
