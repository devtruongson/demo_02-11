import React, { useState, useEffect } from 'react';
import {
  User, ShieldCheck, Mail, Lock, Eye, EyeOff, X, CheckCircle2,
  AlertCircle, RefreshCw, KeyRound, Award, Clock, Calendar, ArrowRight,
  BookOpen, HelpCircle, Check, Pencil, Sparkles
} from 'lucide-react';
import ExamTakingModal from './ExamTakingModal.jsx';

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  authToken,
  onProfileUpdated
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'exams'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Assigned Exams State
  const [assignedExams, setAssignedExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [activeExamId, setActiveExamId] = useState(null);
  const [activeExamMode, setActiveExamMode] = useState('take'); // 'take' | 'review'

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setEmail(currentUser.email || '');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setMessage({ type: '', text: '' });
      setActiveTab('profile');

      if (isOpen && authToken) {
        fetchAssignedExams();
      }
    }
  }, [currentUser, isOpen, authToken]);

  const fetchAssignedExams = async () => {
    if (!authToken) return;
    setLoadingExams(true);
    try {
      const res = await fetch('/api/exam-assignments', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignedExams(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching assigned exams:', err);
    } finally {
      setLoadingExams(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const isTeacher = currentUser.role === 'teacher';
  const isStudent = !isAdmin && !isTeacher;

  const roleLabel = isAdmin ? 'Quản trị viên' : isTeacher ? 'Giáo viên' : 'Học sinh';

  // Count uncompleted exams
  const uncompletedExamsCount = assignedExams.filter((ex) => !ex.submission_id).length;

  const handleOpenTakeExam = (examId) => {
    setActiveExamId(examId);
    setActiveExamMode('take');
  };

  const handleOpenReviewExam = (examId) => {
    setActiveExamId(examId);
    setActiveExamMode('review');
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập họ và tên của bạn.' });
      return;
    }

    if (password) {
      if (password.length < 6) {
        setMessage({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu từ 6 ký tự.' });
        return;
      }
      if (password !== confirmPassword) {
        setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim()
      };
      if (password) {
        payload.password = password;
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật hồ sơ cá nhân');
      }

      setMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
      if (onProfileUpdated) {
        onProfileUpdated(data.user, data.token);
      }

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
                  isAdmin ? 'bg-amber-600' : isTeacher ? 'bg-blue-600' : 'bg-navy'
                }`}
              >
                {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {currentUser.full_name || currentUser.username}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {roleLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">@{currentUser.username}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 bg-slate-50/50 border-b border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                activeTab === 'profile'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('exams')}
              className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                activeTab === 'exams'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Bài thi & Bài tập được giao</span>
              {uncompletedExamsCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                  {uncompletedExamsCount} chưa làm
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                  {assignedExams.length}
                </span>
              )}
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* ================= TAB 1: THÔNG TIN CÁ NHÂN ================= */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmitProfile} className="space-y-4 max-w-lg mx-auto">
                {message.text && (
                  <div
                    className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                      message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{message.text}</span>
                  </div>
                )}

                {/* Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên đăng nhập (Định danh)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.username}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-mono font-bold cursor-not-allowed"
                  />
                </div>

                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên hiển thị *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-navy shadow-xs"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa chỉ Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy shadow-xs"
                  />
                </div>

                {/* Password Change Box */}
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-navy" />
                      <span>Đổi mật khẩu mới (Bỏ trống nếu không đổi)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] font-bold text-navy hover:underline flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Ẩn' : 'Hiện'}</span>
                    </button>
                  </div>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-navy shadow-xs"
                  />

                  {password && (
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận lại mật khẩu mới"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-navy shadow-xs"
                    />
                  )}
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-black transition shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Lưu Thay Đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ================= TAB 2: BÀI THI & BÀI TẬP ĐƯỢC GIAO ================= */}
            {activeTab === 'exams' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Danh Sách Đề Thi & Nhiệm Vụ Trắc Nghiệm
                    </h4>
                    <p className="text-xs text-slate-500">
                      Các bài kiểm tra do Giáo viên hoặc Quản trị viên chỉ định cho bạn
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchAssignedExams}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                    title="Cập nhật danh sách"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingExams ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {loadingExams ? (
                  <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-navy" />
                    <span>Đang kiểm tra danh sách bài thi được giao...</span>
                  </div>
                ) : assignedExams.length === 0 ? (
                  <div className="py-16 text-center bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl">
                      🎉
                    </div>
                    <strong className="block text-sm font-bold text-slate-800">
                      Bạn không có bài kiểm tra nào cần làm!
                    </strong>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Hiện tại giáo viên chưa giao đề thi mới cho bạn. Hãy khám phá thêm kho tư liệu lịch sử và mô hình 3D.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignedExams.map((ex) => {
                      const isCompleted = Boolean(ex.submission_id);
                      const isOverdue = ex.due_date && new Date(ex.due_date) < new Date() && !isCompleted;

                      return (
                        <div
                          key={ex.id}
                          className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isCompleted
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : isOverdue
                              ? 'bg-rose-50/50 border-rose-200'
                              : 'bg-white border-slate-200/90 hover:shadow-md'
                          }`}
                        >
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900 text-gold text-[10px] font-black font-mono">
                                Đề #{ex.id}
                              </span>
                              {isCompleted ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Đã nộp bài • Điểm: {Number(ex.score).toFixed(1)}/10
                                </span>
                              ) : isOverdue ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  Quá hạn nộp
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  Chưa làm
                                </span>
                              )}
                            </div>

                            <h5 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                              {ex.title}
                            </h5>

                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                              <span>Người giao: <strong>{ex.created_by_name || 'Giáo viên'}</strong></span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{ex.duration_minutes || 15} phút</span>
                              </span>
                              <span>•</span>
                              <span>{ex.total_questions_count || ex.question_ids?.length || 0} câu</span>
                              {ex.due_date && (
                                <>
                                  <span>•</span>
                                  <span className="text-[11px] font-mono text-slate-500">
                                    Hạn: {new Date(ex.due_date).toLocaleDateString('vi-VN', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </>
                              )}
                            </div>

                            {ex.description && (
                              <p className="text-xs text-slate-600 line-clamp-2 italic pt-1">
                                "{ex.description}"
                              </p>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0 flex items-center justify-end">
                            {isCompleted ? (
                              <button
                                type="button"
                                onClick={() => handleOpenReviewExam(ex.id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs cursor-pointer"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-navy" />
                                <span>Xem Lời Giải & Điểm ({Number(ex.score).toFixed(1)})</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenTakeExam(ex.id)}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95 cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Làm Bài Thi Ngay</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= INTERACTIVE EXAM MODAL (TAKING / REVIEW) ================= */}
      {activeExamId && (
        <ExamTakingModal
          isOpen={Boolean(activeExamId)}
          assignmentId={activeExamId}
          mode={activeExamMode}
          onClose={() => {
            setActiveExamId(null);
            fetchAssignedExams();
          }}
          onCompleted={() => {
            fetchAssignedExams();
          }}
          authToken={authToken}
        />
      )}
    </>
  );
}
