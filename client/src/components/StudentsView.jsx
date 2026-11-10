import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Users, Award, CheckCircle, CheckCircle2, HelpCircle, BookOpen, Box, Compass,
  ArrowRight, Filter, ShieldCheck, PlusCircle, RefreshCw, Eye, CheckSquare, ChevronDown,
  ChevronUp, Copy, Check, Star, Zap, Target, Edit3, Trash2, RotateCcw, Lightbulb, Landmark,
  Flame, MessageSquare, Trophy, Clock, Calendar, AlertCircle, FileText, Send, Sparkles, LogOut, UserCheck, Search, X,
  GraduationCap
} from 'lucide-react';
import QuizInteractiveComponent from './QuizInteractiveComponent.jsx';
import QuizEditorModal from './QuizEditorModal.jsx';
import StudentTaskEditorModal from './StudentTaskEditorModal.jsx';
import CollaborativeStudySpace from './CollaborativeStudySpace.jsx';
import ExamTakingModal from './ExamTakingModal.jsx';

export default function StudentsView({ currentUser, authToken, topics = [] }) {
  const { tab = 'bai-tap-duoc-giao' } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // TAB: EXAM ASSIGNMENTS (BÀI THI GV GIAO)
  // ==========================================
  const [assignedExams, setAssignedExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [examStatusFilter, setExamStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [examSearch, setExamSearch] = useState('');
  const [activeExamId, setActiveExamId] = useState(null);
  const [activeExamMode, setActiveExamMode] = useState('take'); // 'take' | 'review'

  // ==========================================
  // TAB: MY CLASSES (LỚP HỌC CỦA EM)
  // ==========================================
  const [myClasses, setMyClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState('');
  const [joiningClass, setJoiningClass] = useState(false);
  const [classAlert, setClassAlert] = useState({ type: '', text: '' });
  const [copiedClassCode, setCopiedClassCode] = useState(null);
  const [viewingMembersClass, setViewingMembersClass] = useState(null);
  const [classMembers, setClassMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const uncompletedExamsCount = assignedExams.filter((ex) => !ex.submission_id).length;

  const studentTabs = [
    {
      to: '/hoc-sinh/bai-tap-duoc-giao',
      id: 'bai-tap-duoc-giao',
      label: 'Bài Thi & Đề Kiểm Tra GV Giao',
      icon: Award,
      badge: uncompletedExamsCount > 0 ? `${uncompletedExamsCount}` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      to: '/hoc-sinh/lop-hoc',
      id: 'lop-hoc',
      label: 'Lớp Học Của Em',
      icon: Users,
      badge: myClasses.length > 0 ? `${myClasses.length} lớp` : null,
      badgeColor: 'bg-amber-400 text-slate-950 font-black'
    },
    { to: '/hoc-sinh/nhiem-vu', id: 'nhiem-vu', label: 'Nhiệm Vụ Học Tập', icon: BookOpen },
    { to: '/hoc-sinh/luyen-tap-trac-nghiem', id: 'luyen-tap-trac-nghiem', label: 'Luyện Tập Tự Do', icon: HelpCircle },
    { to: '/hoc-sinh/bang-xep-hang-streak', id: 'bang-xep-hang-streak', label: 'Bảng Vàng Chuỗi Streak 🔥', icon: Flame },
    { to: '/hoc-sinh/khong-gian-chung', id: 'khong-gian-chung', label: 'Không Gian Học Tập Chung 💬', icon: MessageSquare },
  ];

  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

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

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const res = await fetch(`/api/students/streak-leaderboard?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Lỗi tải bảng xếp hạng streak:', err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const fetchAssignedExams = async () => {
    if (!authToken) return;
    try {
      setLoadingExams(true);
      const res = await fetch(`/api/exam-assignments?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignedExams(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Lỗi khi nạp bài tập được giao:', err);
    } finally {
      setLoadingExams(false);
    }
  };

  const fetchMyClasses = async () => {
    if (!authToken) return;
    try {
      setLoadingClasses(true);
      const res = await fetch(`/api/student/classes?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyClasses(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Lỗi khi nạp danh sách lớp học:', err);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!classCodeInput.trim() || !authToken) return;
    setClassAlert({ type: '', text: '' });
    try {
      setJoiningClass(true);
      const res = await fetch('/api/student/classes/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ code: classCodeInput.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Tham gia lớp học không thành công');
      }
      setClassAlert({ type: 'success', text: data.message });
      setClassCodeInput('');
      await fetchMyClasses();
      await fetchAssignedExams();
    } catch (err) {
      setClassAlert({ type: 'error', text: err.message });
    } finally {
      setJoiningClass(false);
    }
  };

  const handleLeaveClass = async (classId, className) => {
    if (!window.confirm(`Em có chắc chắn muốn rời khỏi lớp học "${className}" không?`)) return;
    try {
      const res = await fetch('/api/student/classes/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ class_id: classId })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi rời lớp');
      }
      await fetchMyClasses();
      if (viewingMembersClass?.id === classId) {
        setViewingMembersClass(null);
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleViewClassMembers = async (cls) => {
    setViewingMembersClass(cls);
    setClassMembers([]);
    try {
      setLoadingMembers(true);
      const res = await fetch(`/api/student/classes/${cls.id}/members?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClassMembers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Lỗi nạp thành viên lớp:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchTasks(taskLessonFilter);
    fetchLessons();
    fetchLeaderboard();
    if (authToken) {
      fetchAssignedExams();
      fetchMyClasses();
    }
  }, [authToken]);

  useEffect(() => {
    fetchTasks(taskLessonFilter);
  }, [taskLessonFilter]);

  useEffect(() => {
    fetchQuizzes(selectedLesson);
  }, [selectedLesson]);

  const filteredExams = assignedExams.filter((exam) => {
    if (examStatusFilter === 'pending' && exam.submission_id) return false;
    if (examStatusFilter === 'completed' && !exam.submission_id) return false;
    if (examSearch.trim()) {
      const q = examSearch.toLowerCase();
      const matchTitle = exam.title && exam.title.toLowerCase().includes(q);
      const matchTeacher = exam.created_by_name && exam.created_by_name.toLowerCase().includes(q);
      const matchDesc = exam.description && exam.description.toLowerCase().includes(q);
      return matchTitle || matchTeacher || matchDesc;
    }
    return true;
  });

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
      } catch { }
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
      } catch { }
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
      } catch { }
    }
  };

  // Copy task submission to clipboard
  const handleCopySubmission = (task) => {
    const progress = taskProgress[task.id] || { checks: [], note: '' };
    const checklist = Array.isArray(task.checklist) ? task.checklist : [];
    const completedCount = progress.checks?.length || 0;
    const note = progress.note || '(Chưa có ghi chép)';

    const text = `=== BÀI NỘP NHIỆM VỤ LỊCH SỬ 10 ===\n` +
      `Học sinh: ${currentUser?.full_name || 'Học sinh Sử Học Số'}\n` +
      `Nhiệm vụ: ${task.title}\n` +
      `Bài học: ${task.lesson}\n` +
      `Tiến độ: ${completedCount}/${checklist.length} tiêu chí hoàn thành (${Math.round((completedCount / (checklist.length || 1)) * 100)}%)\n\n` +
      `* Ghi chép & Thu hoạch của em:\n${note}\n\n` +
      `--- Nền tảng Sử Học Số GDPT 2018 ---`;

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
    ? { title: 'Chuyên Gia Di Sản Số', badge: 'Cấp độ III' }
    : totalXPEarned >= 150
      ? { title: 'Nhà Khảo Cổ Trẻ', badge: 'Cấp độ II' }
      : { title: 'Học Sinh Tập Sự', badge: 'Cấp độ I' };

  // 3 Method Steps definition
  const methodSteps = [
    {
      step: '01',
      title: 'Quan Sát Chi Tiết 3D',
      subtitle: 'Xoay 360°, bóc tách hoa văn & đo đạc khảo cổ',
      guide: [
        'Dùng ngón tay hoặc chuột kéo xoay 360 độ đa chiều để bao quát dáng vẻ hiện vật.',
        'Nhấn đúp hoặc dùng con lăn cuộn chuột để phóng to quan sát các hoa văn chạm khắc tinh xảo.',
        'Chuyển đổi các góc ánh sáng (Ánh sáng Bảo tàng, Chiếu thẳng, Ánh sáng xiên) để làm nổi bật nét khắc mờ.',
        'Bật thước đo tỷ lệ khảo cổ để đối chiếu kích thước thực tế so với trang sách giáo khoa.'
      ],
      sampleTitle: 'Thực hành với Trống đồng Ngọc Lũ 3D',
      sampleUrl: '/studio-3d/co-vat/dong_son_drum',
      sampleIcon: Box
    },
    {
      step: '02',
      title: 'Đọc Bối Cảnh Lịch Sử',
      subtitle: 'Tra cứu niên đại, xuất xứ & ý nghĩa văn minh',
      guide: [
        'Nắm vững niên đại hình thành và thời kỳ lịch sử tương ứng trong chương trình Lịch sử 10.',
        'Xác định tọa độ phát hiện khảo cổ học và bảo tàng lưu giữ hiện vật nguyên bản.',
        'Đọc bản dịch văn bia (nếu là bia đá chữ Phạn cổ) để hiểu tư tưởng tôn giáo và chính trị đương thời.',
        'Đối chiếu với các đoạn tư liệu viết trong SGK Kết nối tri thức, Cánh Diều hoặc Chân trời sáng tạo.'
      ],
      sampleTitle: 'Tư liệu Văn minh Đông Nam Á',
      sampleUrl: '/kho-tu-lieu?topic=4',
      sampleIcon: Compass
    },
    {
      step: '03',
      title: 'Thử Thách & Đối Chiếu',
      subtitle: 'Làm trắc nghiệm, phản biện & ghi chép thu hoạch',
      guide: [
        'Vào tab Đấu Trường Trắc Nghiệm để làm các câu hỏi trắc nghiệm phân hóa theo bài học.',
        'Tự đặt câu hỏi phản biện: Hiện vật phản ánh đời sống vật chất hay tâm linh của tổ tiên ta?',
        'Điền cảm nhận và câu trả lời vào ô "Nhật ký thu hoạch của em" bên dưới mỗi nhiệm vụ.',
        'Bấm "Sao chép bài nộp" để nộp báo cáo thu hoạch cho giáo viên bộ môn qua Zalo hoặc Google Classroom.'
      ],
      sampleTitle: 'Vào Đấu Trường Trắc Nghiệm',
      sampleUrl: '/hoc-sinh/luyen-tap-trac-nghiem',
      sampleIcon: Award
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Student Banner - Warm royal lacquer red & golden accents */}
      <div className="bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] text-white p-6 sm:p-8 rounded-3xl border border-amber-300/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-[#FDE2A7] border border-amber-300/40 mb-3">
            <Users className="w-3.5 h-3.5 text-[#FDE2A7]" />
            <span>Góc Tự Học & Khám Phá Của Học Sinh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif-royal leading-snug">
            Khám Phá Lịch Sử 10 Trực Quan & Sâu Sắc
          </h2>
          <p className="mt-2 text-[#FFF7E8]/90 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
            Tự mình tương tác với các cổ vật 3D, hoàn thành nhiệm vụ thu hoạch và thử thách kiến thức qua hệ thống câu hỏi chuẩn GDPT 2018.
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
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition ${isActive
                      ? 'bg-[#FFFDF5] text-[#850B10] shadow-md font-bold'
                      : 'bg-black/25 hover:bg-black/40 text-white/90 border border-white/15'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.label}</span>
                  {t.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#850B10] text-[#FFFDF5]' : (t.badgeColor || 'bg-rose-500 text-white')
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
          <Link
            to="/studio-3d"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFFDF5] text-[#850B10] hover:bg-[#FAF5EB] font-bold text-xs transition shadow-md text-center"
          >
            <Box className="w-4 h-4 text-[#850B10]" />
            <span>Mở Studio 3D</span>
          </Link>
          <Link
            to="/kho-tu-lieu"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-black/25 hover:bg-black/40 text-white font-medium text-xs transition border border-white/20 text-center"
          >
            <BookOpen className="w-4 h-4 text-[#FDE2A7]" />
            <span>Tra Cứu Tư Liệu</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB: BÀI TẬP & ĐỀ KIỂM TRA GV GIAO                        */}
      {/* ========================================================= */}
      {tab === 'bai-tap-duoc-giao' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: Total assigned */}
            <div className="p-5 rounded-3xl bg-white border border-[#EBDBC5] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Tổng bài tập được giao
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {assignedExams.length} bài
                </span>
                <span className="text-[11px] text-slate-400">
                  Từ thầy cô bộ môn Lịch sử 10
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5DC] text-[#850B10] flex items-center justify-center font-bold shrink-0">
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 2: Pending exams */}
            <div className={`p-5 rounded-3xl border shadow-xs flex items-center justify-between ${
              uncompletedExamsCount > 0 ? 'bg-[#FFF9F5] border-rose-200' : 'bg-white border-[#EBDBC5]'
            }`}>
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                  Cần làm ngay
                </span>
                <span className="text-2xl font-black text-rose-600 mt-1 block">
                  {uncompletedExamsCount} bài
                </span>
                <span className="text-[11px] text-slate-500">
                  {uncompletedExamsCount > 0 ? 'Chưa nộp bài - hãy hoàn thành sớm!' : 'Tuyệt vời, không có bài tồn đọng!'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 3: Completed count */}
            <div className="p-5 rounded-3xl bg-white border border-[#EBDBC5] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Đã hoàn thành
                </span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  {assignedExams.filter(e => e.submission_id).length} bài
                </span>
                <span className="text-[11px] text-slate-500">
                  Đã chấm điểm & có lời giải chi tiết
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter status pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setExamStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  examStatusFilter === 'all'
                    ? 'bg-[#850B10] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({assignedExams.length})
              </button>
              <button
                type="button"
                onClick={() => setExamStatusFilter('pending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  examStatusFilter === 'pending'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-rose-700 hover:bg-rose-50'
                }`}
              >
                <span>Chưa làm ({uncompletedExamsCount})</span>
                {uncompletedExamsCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />}
              </button>
              <button
                type="button"
                onClick={() => setExamStatusFilter('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  examStatusFilter === 'completed'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                Đã nộp bài ({assignedExams.filter(e => e.submission_id).length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={examSearch}
                onChange={(e) => setExamSearch(e.target.value)}
                placeholder="Tìm bài thi, giáo viên..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#850B10]"
              />
              {examSearch && (
                <button
                  type="button"
                  onClick={() => setExamSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Exam List */}
          {loadingExams ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-[#850B10] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-500">Đang tải danh sách bài tập được giao...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF5DC] text-[#850B10] mx-auto flex items-center justify-center font-bold">
                <Award className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-slate-900">
                {examStatusFilter === 'pending'
                  ? 'Không có bài tập nào cần làm ngay!'
                  : examStatusFilter === 'completed'
                    ? 'Em chưa hoàn thành bài thi nào.'
                    : 'Chưa có bài thi hoặc bài tập nào được giao.'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {examStatusFilter === 'pending'
                  ? 'Em đã hoàn thành xuất sắc các bài tập được thầy cô giao. Hãy tiếp tục duy trì phong độ nhé!'
                  : 'Khi thầy cô giao bài kiểm tra 15 phút, 1 tiết hoặc bài tập theo lớp, bài thi sẽ hiển thị ngay tại đây để em làm bài trực tuyến.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredExams.map((exam) => {
                const isDone = !!exam.submission_id;
                return (
                  <div
                    key={exam.id}
                    className={`rounded-3xl border p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                      isDone
                        ? 'bg-white border-slate-200 hover:border-emerald-300'
                        : 'bg-[#FFFDF9] border-[#EBDBC5] hover:border-rose-300'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header tag */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                            : 'bg-rose-100 text-rose-800 border border-rose-300/80'
                        }`}>
                          {isDone ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ĐÃ HOÀN THÀNH</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-rose-600" />
                              <span>CHƯA LÀM</span>
                            </>
                          )}
                        </span>

                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>GV: {exam.created_by_name || 'Thầy/Cô'}</span>
                        </span>
                      </div>

                      {/* Exam Title */}
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug">
                          {exam.title}
                        </h4>
                        {exam.description && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {exam.description}
                          </p>
                        )}
                      </div>

                      {/* Metadata Pills */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <strong>{exam.duration_minutes || 15} phút</strong>
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                          <strong>{exam.total_questions_count || (Array.isArray(exam.question_ids) ? exam.question_ids.length : 0)} câu hỏi</strong>
                        </span>
                        {exam.due_date && (
                          <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-amber-700" />
                            <span>Hạn: {new Date(exam.due_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Card Actions & Score */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      {isDone ? (
                        <>
                          <div>
                            <div className="text-[11px] text-slate-400">Điểm số đạt được:</div>
                            <div className="text-xl font-black text-emerald-700">
                              {Number(exam.score).toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 10</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              ({exam.correct_count}/{exam.total_questions} câu đúng)
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveExamId(exam.id);
                              setActiveExamMode('review');
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span>Xem lại bài làm</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-rose-600 font-semibold italic">
                            Chưa nộp bài
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveExamId(exam.id);
                              setActiveExamMode('take');
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102 active:scale-98"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#FDE2A7]" />
                            <span>LÀM BÀI NGAY</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: LỚP HỌC CỦA EM                                       */}
      {/* ========================================================= */}
      {tab === 'lop-hoc' && (
        <div className="space-y-6 animate-fade-in">
          {/* Box: Join Class with Code */}
          <div className="bg-[#FFFDF5] p-5 sm:p-7 rounded-3xl border border-[#EBDBC5] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EBDBC5]/60">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#850B10]">
                  Kết nối lớp học trực tuyến
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#2D1B08] mt-0.5 font-serif-royal">
                  Tham Gia Lớp Học Bằng Mã (Class Code)
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-normal">
                Hỏi thầy/cô bộ môn Lịch sử để nhận mã lớp học
              </span>
            </div>

            <form onSubmit={handleJoinClass} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
                  placeholder="Nhập mã lớp do giáo viên cung cấp (Ví dụ: LS10A1, LS4EGCR)..."
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EBDBC5] text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#850B10] uppercase tracking-wider"
                />
              </div>
              <button
                type="submit"
                disabled={joiningClass || !classCodeInput.trim()}
                className="px-6 py-3 rounded-2xl bg-[#850B10] hover:bg-[#68070B] text-white font-black text-xs transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-2"
              >
                {joiningClass ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>THAM GIA LỚP HỌC</span>
                  </>
                )}
              </button>
            </form>

            {classAlert.text && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                classAlert.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {classAlert.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{classAlert.text}</span>
              </div>
            )}
          </div>

          {/* List of joined classes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#850B10]" />
                <span>Danh Sách Lớp Học Đã Tham Gia ({myClasses.length})</span>
              </h4>
              <button
                type="button"
                onClick={fetchMyClasses}
                className="text-xs font-bold text-[#850B10] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Làm mới</span>
              </button>
            </div>

            {loadingClasses ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <div className="w-8 h-8 border-3 border-[#850B10] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-500">Đang tải danh sách lớp học của em...</p>
              </div>
            ) : myClasses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF5DC] text-[#850B10] mx-auto flex items-center justify-center font-bold">
                  <Users className="w-7 h-7" />
                </div>
                <h5 className="font-bold text-base text-slate-800">Em chưa tham gia lớp học nào</h5>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Hãy liên hệ với thầy cô giáo bộ môn Lịch sử 10 để nhận mã lớp học (VD: <strong>LS10A1</strong>), sau đó nhập mã vào khung bên trên để nhận bài kiểm tra và tham gia học tập cùng lớp nhé!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-white rounded-3xl border border-[#EBDBC5] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-[#850B10] text-[#FFF7E8] text-xs font-black">
                          {cls.grade || 'Lớp 10'}
                        </span>
                        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl text-xs">
                          <span className="text-[10px] text-amber-800 font-bold uppercase">Mã lớp:</span>
                          <strong className="text-[#850B10] font-black">{cls.code}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(cls.code);
                              setCopiedClassCode(cls.id);
                              setTimeout(() => setCopiedClassCode(null), 2000);
                            }}
                            className="text-amber-800 hover:text-amber-950 p-0.5 cursor-pointer"
                            title="Sao chép mã lớp"
                          >
                            {copiedClassCode === cls.id ? (
                              <Check className="w-3 h-3 text-emerald-600 font-bold" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-base sm:text-lg text-slate-900 leading-snug">
                          {cls.name}
                        </h4>
                        {cls.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {cls.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <GraduationCap className="w-4 h-4 text-[#850B10]" />
                          <span>GV: <strong>{cls.teacher_name || 'Giáo viên bộ môn'}</strong></span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.student_count || 1} bạn học</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewClassMembers(cls)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Xem thành viên</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate('/hoc-sinh/bai-tap-duoc-giao')}
                          className="px-3.5 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <span>Xem bài tập</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLeaveClass(cls.id, cls.name)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          title="Rời lớp học này"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal: Classmates list */}
          {viewingMembersClass && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#850B10] text-white">
                  <div>
                    <h3 className="font-bold text-base font-serif-royal">
                      Danh Sách Thành Viên Lớp
                    </h3>
                    <p className="text-xs text-[#FFF7E8]/80 mt-0.5">
                      {viewingMembersClass.name} • Mã: {viewingMembersClass.code}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewingMembersClass(null)}
                    className="p-1.5 rounded-xl hover:bg-white/20 text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1 space-y-2">
                  {loadingMembers ? (
                    <div className="py-8 text-center text-xs font-bold text-slate-500">
                      Đang tải danh sách bạn học...
                    </div>
                  ) : classMembers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Lớp chưa có thành viên khác.
                    </div>
                  ) : (
                    classMembers.map((m, idx) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-xs text-slate-800 block">
                              {m.full_name} {m.id === currentUser?.id && '(Bạn)'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              @{m.username}
                            </span>
                          </div>
                        </div>
                        {m.streak_count > 0 && (
                          <span className="text-xs font-bold text-orange-600 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                            <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                            <span>{m.streak_count}d</span>
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: NHIỆM VỤ HỌC TẬP & PHƯƠNG PHÁP                     */}
      {/* ========================================================= */}
      {tab === 'nhiem-vu' && (
        <div className="space-y-6 sm:space-y-8">
          {/* SECTION 1: INTERACTIVE 3-STEP METHOD */}
          <div className="bg-[#FFFDF5] p-5 sm:p-7 rounded-3xl border border-[#EBDBC5] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EBDBC5]/60">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#850B10]">
                  Quy trình rèn luyện năng lực
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#2D1B08] mt-0.5 font-serif-royal">
                  Phương Pháp Khai Thác Tư Liệu Số
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-normal">
                Bấm vào từng bước để xem hướng dẫn chi tiết
              </span>
            </div>

            {/* 3 Clickable Method Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {methodSteps.map((s, idx) => {
                const isSelected = activeMethodStep === idx;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveMethodStep(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${isSelected
                        ? 'bg-[#FFFDF5] border-[#850B10] ring-1 ring-[#850B10] shadow-sm'
                        : 'bg-[#FAF5EB] hover:bg-[#FFFDF5] border-[#EBDBC5] text-[#2D1B08]'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs transition ${isSelected
                              ? 'bg-[#850B10] text-white shadow-xs'
                              : 'bg-[#EBDBC5]/70 text-[#850B10]'
                            }`}
                        >
                          {s.step}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#850B10]/10 text-[#850B10] uppercase tracking-wider border border-[#850B10]/20">
                            Đang xem
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-[#2D1B08]">
                        {s.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {s.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#EBDBC5]/50 flex items-center justify-between text-xs font-medium">
                      <span className={isSelected ? 'text-[#850B10] font-bold' : 'text-stone-400'}>
                        {isSelected ? 'Đang kích hoạt' : 'Xem chi tiết'}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#850B10]' : 'text-stone-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expanded Active Step Detail Panel */}
            <div className="p-5 rounded-2xl bg-[#FAF5EB] border border-[#EBDBC5] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBDBC5]/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#850B10] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {methodSteps[activeMethodStep].step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2D1B08]">
                      Hướng Dẫn Thao Tác: {methodSteps[activeMethodStep].title}
                    </h4>
                    <p className="text-xs text-stone-600">
                      {methodSteps[activeMethodStep].subtitle}
                    </p>
                  </div>
                </div>

                <div>
                  {(() => {
                    const SampleIcon = methodSteps[activeMethodStep].sampleIcon;
                    return (
                      <Link
                        to={methodSteps[activeMethodStep].sampleUrl}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-xs"
                      >
                        <SampleIcon className="w-3.5 h-3.5 text-[#FDE2A7]" />
                        <span>{methodSteps[activeMethodStep].sampleTitle}</span>
                      </Link>
                    );
                  })()}
                </div>
              </div>

              {/* Step Checklist/Guidance Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {methodSteps[activeMethodStep].guide.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF5] border border-[#EBDBC5]">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-[#850B10] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-amber-300/40">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed font-normal">
                      {g}
                    </p>
                  </div>
                ))}
              </div>

              {/* Next Step Button */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-normal">
                  Bước {activeMethodStep + 1} / 3 phương pháp
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMethodStep((prev) => (prev + 1) % 3)}
                  className="font-bold text-[#850B10] hover:text-[#68070B] transition flex items-center gap-1"
                >
                  <span>Chuyển sang Bước {((activeMethodStep + 1) % 3) + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: STUDENT QUEST ARENA */}
          <div className="space-y-5">
            {/* Quest Header & Progress Dashboard */}
            <div className="bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] text-white p-5 sm:p-7 rounded-3xl border border-amber-300/30 shadow-lg relative overflow-hidden space-y-5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-[#FDE2A7]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FDE2A7]">
                      Hệ Thống Nhiệm Vụ Khám Phá Lịch Sử 10
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1 font-serif-royal">
                    Bảng Nhiệm Vụ & Nhật Ký Thu Hoạch Của Học Sinh
                  </h3>
                  <p className="text-xs text-[#FFF7E8]/90 mt-1 max-w-xl leading-relaxed font-normal">
                    Hoàn thành các tiêu chí khám phá hiện vật, thu thập điểm kinh nghiệm (XP) và ghi lại những phát hiện lịch sử của riêng em.
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={handleOpenAddTask}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFDF5] hover:bg-[#FAF5EB] text-[#850B10] font-bold text-xs transition shadow-md shrink-0 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Thêm nhiệm vụ</span>
                  </button>
                )}
              </div>

              {/* Progress & Ranking Metrics */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Metric 1 */}
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/15">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#FFF7E8]/80 font-medium">Tiến độ nhiệm vụ</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FDE2A7]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <strong className="text-2xl font-bold text-white">
                      {completedTasksCount} / {totalTasksCount}
                    </strong>
                    <span className="text-xs text-[#FDE2A7] font-medium">
                      ({totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#FDE2A7] h-full rounded-full transition-all duration-300"
                      style={{ width: `${totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/15">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#FFF7E8]/80 font-medium">Điểm tích lũy</span>
                    <Zap className="w-3.5 h-3.5 text-[#FDE2A7]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <strong className="text-2xl font-bold text-white">
                      {totalXPEarned}
                    </strong>
                    <span className="text-xs text-[#FFF7E8]/70">/ {totalPossibleXP} XP</span>
                  </div>
                  <span className="text-[11px] text-[#FDE2A7]/90 mt-1 block">
                    Điểm đánh giá năng lực
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#FFF7E8]/80 font-medium block">Cấp bậc học tập</span>
                    <h5 className="text-base font-bold mt-1 text-[#FDE2A7]">
                      {studentRank.title}
                    </h5>
                    <span className="text-[11px] text-white/80 mt-0.5 block">
                      {studentRank.badge}
                    </span>
                  </div>
                  <button
                    onClick={handleResetProgress}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFF7E8] transition cursor-pointer"
                    title="Đặt lại tiến độ làm bài"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter by Lesson */}
            <div className="bg-[#FFFDF5] p-3.5 sm:p-4 rounded-2xl border border-[#EBDBC5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#850B10]" />
                <span className="text-xs font-bold text-[#2D1B08]">Lọc theo bài học:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setTaskLessonFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${taskLessonFilter === 'all'
                      ? 'bg-[#850B10] text-white shadow-xs'
                      : 'bg-[#FAF5EB] text-[#2D1B08] border border-[#EBDBC5] hover:bg-[#FFFDF5]'
                    }`}
                >
                  Tất cả bài học ({tasks.length})
                </button>
                {Array.from(new Set(tasks.map((t) => t.lesson))).map((les) => (
                  <button
                    key={les}
                    onClick={() => setTaskLessonFilter(les)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${taskLessonFilter === les
                        ? 'bg-[#850B10] text-white font-bold shadow-xs'
                        : 'bg-[#FAF5EB] text-[#2D1B08] border border-[#EBDBC5] hover:bg-[#FFFDF5]'
                      }`}
                  >
                    {les.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Cards List */}
            {loadingTasks ? (
              <div className="bg-[#FFFDF5] p-12 rounded-3xl border border-[#EBDBC5] text-center space-y-2">
                <RefreshCw className="w-5 h-5 text-[#850B10] animate-spin mx-auto" />
                <p className="text-xs text-stone-500">Đang tải danh sách nhiệm vụ...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-[#FFFDF5] p-12 rounded-3xl border border-[#EBDBC5] text-center space-y-2">
                <Target className="w-7 h-7 text-stone-400 mx-auto" />
                <p className="text-sm font-semibold text-[#2D1B08]">Chưa có nhiệm vụ học tập nào phù hợp.</p>
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
                      className={`bg-[#FFFDF5] rounded-3xl border transition-all duration-150 shadow-xs overflow-hidden ${isFullyCompleted
                          ? 'border-emerald-300/80 bg-[#FAF5EB]/80'
                          : 'border-[#EBDBC5] hover:border-amber-300'
                        }`}
                    >
                      {/* Task Header */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-[#850B10] border border-amber-300/50">
                              {task.badge || 'Khám Phá Di Sản'}
                            </span>
                            <span className="text-xs text-stone-600 font-medium">
                              • {task.lesson}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF5EB] text-stone-700 border border-[#EBDBC5]">
                              {task.difficulty === 'co_ban' ? 'Cơ bản' : task.difficulty === 'van_dung' ? 'Vận dụng' : 'Thông hiểu'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#850B10]/10 text-[#850B10] border border-[#850B10]/20 font-bold text-xs">
                              +{task.reward_xp || 100} XP
                            </span>

                            {isAdmin && (
                              <div className="flex items-center gap-1 pl-2 border-l border-[#EBDBC5]">
                                <button
                                  onClick={() => handleOpenEditTask(task)}
                                  className="p-1.5 rounded-md text-stone-400 hover:text-[#850B10] hover:bg-[#FAF5EB] transition cursor-pointer"
                                  title="Sửa nhiệm vụ"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id, task.title)}
                                  className="p-1.5 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
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
                          <h4 className="text-base sm:text-lg font-bold text-[#2D1B08] leading-snug">
                            {task.title}
                          </h4>
                          <p className="mt-1 text-xs text-stone-600 leading-relaxed font-normal">
                            {task.description}
                          </p>
                        </div>

                        {/* Interactive Checklist Header & Progress Bar */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-[#2D1B08] flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5 text-[#850B10]" />
                              Tiêu chí hoàn thành ({completedChecks.length}/{checklist.length}):
                            </span>
                            <span className={`font-bold text-xs ${isFullyCompleted ? 'text-emerald-700' : 'text-[#850B10]'}`}>
                              {isFullyCompleted ? 'Đã hoàn thành' : `${completionPercent}%`}
                            </span>
                          </div>
                          <div className="w-full bg-[#FAF5EB] border border-[#EBDBC5] h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300 bg-[#850B10]"
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
                                className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 cursor-pointer ${isChecked
                                    ? 'bg-[#FAF5EB] border-[#EBDBC5] text-stone-500'
                                    : 'bg-[#FFFDF5] hover:bg-[#FAF5EB]/60 border-[#EBDBC5] text-[#2D1B08]'
                                  }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition ${isChecked
                                      ? 'bg-[#850B10] border-[#850B10] text-white shadow-2xs'
                                      : 'border-[#EBDBC5] bg-white'
                                    }`}
                                >
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                </div>
                                <span className={`text-xs leading-relaxed ${isChecked ? 'line-through text-stone-400' : ''}`}>
                                  {step}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Student Field Notebook (Nhật ký thu hoạch) */}
                        <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#EBDBC5] space-y-2.5 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#2D1B08] flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-[#850B10]" />
                              Nhật ký thu hoạch của em:
                            </span>
                            {savedNoteTaskId === task.id && (
                              <span className="text-[11px] font-bold text-emerald-700 animate-fade-in flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-700" /> Đã lưu ghi chép
                              </span>
                            )}
                          </div>

                          {task.reflection_prompt && (
                            <p className="text-xs text-stone-600 italic leading-relaxed">
                              Gợi ý: {task.reflection_prompt}
                            </p>
                          )}

                          <textarea
                            rows={3}
                            value={progress.note || ''}
                            onChange={(e) => handleNoteChange(task.id, e.target.value)}
                            placeholder="Ghi lại các chi tiết lịch sử, nhận xét hoặc cảm nhận của em..."
                            className="w-full p-3 rounded-xl border border-[#EBDBC5] bg-[#FFFDF5] text-xs text-[#2D1B08] placeholder-stone-400 focus:outline-none focus:border-[#850B10]"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveNote(task.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white font-bold text-xs transition shadow-2xs cursor-pointer"
                            >
                              Lưu ghi chép
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopySubmission(task)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFFDF5] hover:bg-[#FAF5EB] text-[#2D1B08] border border-[#EBDBC5] text-xs font-semibold transition cursor-pointer"
                            >
                              {copiedTaskId === task.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-800 font-bold">Đã sao chép bài nộp</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Sao chép bài nộp</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-[#EBDBC5]/60 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs text-stone-600 font-normal">
                            Đối tượng: <strong className="text-[#2D1B08] font-bold">{task.target_title || 'Mô hình 3D'}</strong>
                          </span>

                          <Link
                            to={task.target_url || '/studio-3d'}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-2xs ml-auto"
                          >
                            <Box className="w-3.5 h-3.5 text-[#FDE2A7]" />
                            <span>Bắt đầu nhiệm vụ</span>
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
      {/* TAB 3: BẢNG VÀNG CHUỖI STREAK                             */}
      {/* ========================================================= */}
      {tab === 'bang-xep-hang-streak' && (
        <div className="space-y-6">
          <div className="bg-[#FFFDF5] p-6 sm:p-7 rounded-3xl border border-[#EBDBC5] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBDBC5]/60">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-[#850B10] border border-amber-300/50 mb-1">
                  <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
                  <span>Thi Đua Tự Học GDPT 2018</span>
                </div>
                <h3 className="text-xl font-bold text-[#2D1B08] font-serif-royal">
                  Bảng Vàng Chuỗi Ngày Đăng Nhập Học Bài (Streak)
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-bold">
                Xếp hạng toàn hệ thống
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-amber-300/60 text-xs text-[#2D1B08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
                <div>
                  <strong className="block text-[#850B10] font-bold">Quy tắc duy trì chuỗi Streak:</strong>
                  <span>Mỗi ngày đăng nhập học bài, làm trắc nghiệm sẽ cộng thêm +1 ngày. Giữ lửa học tập để nhận danh hiệu "Học Giả Lịch Sử"!</span>
                </div>
              </div>
              {currentUser && (
                <div className="px-3.5 py-2 rounded-xl bg-[#FFFDF5] border border-amber-300/80 font-bold text-[#850B10] shrink-0 shadow-2xs">
                  Chuỗi của bạn: {currentUser.streak_count || 1} ngày 🔥
                </div>
              )}
            </div>

            {loadingLeaderboard ? (
              <div className="py-12 text-center text-xs text-stone-400">Đang nạp dữ liệu Bảng Vàng...</div>
            ) : leaderboard.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">Chưa có dữ liệu xếp hạng</div>
            ) : (
              <div className="divide-y divide-[#EBDBC5]/50">
                {leaderboard.map((student, idx) => {
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;

                  return (
                    <div
                      key={student.id}
                      className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition rounded-2xl my-1 ${isTop1
                          ? 'bg-amber-50/90 border border-amber-300 shadow-xs'
                          : isTop2
                            ? 'bg-[#FAF5EB] border border-[#EBDBC5]'
                            : isTop3
                              ? 'bg-orange-50/60 border border-amber-200'
                              : 'hover:bg-[#FAF5EB]'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${isTop1
                            ? 'bg-[#850B10] text-[#FDE2A7] shadow-md ring-2 ring-amber-300'
                            : isTop2
                              ? 'bg-[#EBDBC5] text-[#850B10]'
                              : isTop3
                                ? 'bg-amber-700 text-white'
                                : 'bg-[#FAF5EB] text-stone-600 border border-[#EBDBC5]'
                          }`}>
                          {idx + 1}
                        </div>

                        {/* Name & Account */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-[#2D1B08] truncate">
                              {student.full_name || student.username}
                            </span>
                            {isTop1 && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-400 text-[#2D1B08] shadow-2xs">
                                👑 Quán Quân
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 font-mono">
                            @{student.username} • {student.exams_completed || 0} bài kiểm tra hoàn thành
                          </span>
                        </div>
                      </div>

                      {/* Streak Display */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF5] border border-[#EBDBC5] shadow-2xs shrink-0">
                        <Flame className={`w-4 h-4 ${isTop1 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-amber-500 fill-amber-500'
                          }`} />
                        <span className="font-bold text-sm text-[#2D1B08]">
                          {student.streak_count || 1} ngày
                        </span>
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
      {/* TAB 4: KHÔNG GIAN HỌC TẬP CHUNG                           */}
      {/* ========================================================= */}
      {tab === 'khong-gian-chung' && (
        <CollaborativeStudySpace
          currentUser={currentUser}
          authToken={authToken}
          topics={topics}
        />
      )}

      {/* ========================================================= */}
      {/* TAB 2: THỬ THÁCH TRẮC NGHIỆM TỪNG BÀI                     */}
      {/* ========================================================= */}
      {tab === 'luyen-tap-trac-nghiem' && (
        <div className="space-y-6">
          {/* Lesson Filter & Header */}
          <div className="bg-[#FFFDF5] p-5 sm:p-6 rounded-3xl border border-[#EBDBC5] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EBDBC5]/60">
              <div>
                <span className="text-xs font-semibold text-[#850B10] uppercase tracking-wider">
                  Đấu Trường Trắc Nghiệm GDPT 2018
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#2D1B08] mt-0.5 font-serif-royal">
                  Luyện Tập & Củng Cố Kiến Thức Từng Bài Học
                </h3>
              </div>

              {isAdmin && (
                <button
                  onClick={handleOpenAddQuiz}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white font-bold text-xs transition shadow-xs shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Thêm câu hỏi mới</span>
                </button>
              )}
            </div>

            {/* Lesson Selector Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#850B10] block">
                Chọn Bài Học / Chuyên Đề:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedLesson('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${selectedLesson === 'all'
                      ? 'bg-[#850B10] text-white shadow-xs'
                      : 'bg-[#FAF5EB] hover:bg-[#FFFDF5] text-[#2D1B08] border border-[#EBDBC5]'
                    }`}
                >
                  Tất cả các bài ({quizzes.length})
                </button>

                {lessons.map((les) => (
                  <button
                    key={les.lesson}
                    onClick={() => setSelectedLesson(les.lesson)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${selectedLesson === les.lesson
                        ? 'bg-[#850B10] text-white font-bold shadow-xs'
                        : 'bg-[#FAF5EB] hover:bg-[#FFFDF5] text-[#2D1B08] border border-[#EBDBC5]'
                      }`}
                  >
                    <span>{les.lesson}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-[#850B10] font-bold border border-amber-300/40">
                      {les.question_count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Quiz Player */}
          {loadingQuizzes ? (
            <div className="bg-[#FFFDF5] p-12 rounded-3xl border border-[#EBDBC5] text-center space-y-2">
              <RefreshCw className="w-5 h-5 text-[#850B10] animate-spin mx-auto" />
              <p className="text-xs font-medium text-stone-500">Đang tải bộ câu hỏi...</p>
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

      {/* Exam Taking & Review Modal */}
      <ExamTakingModal
        isOpen={!!activeExamId}
        assignmentId={activeExamId}
        mode={activeExamMode}
        authToken={authToken}
        currentUser={currentUser}
        onClose={() => setActiveExamId(null)}
        onCompleted={() => {
          setActiveExamId(null);
          fetchAssignedExams();
        }}
      />
    </div>
  );
}
