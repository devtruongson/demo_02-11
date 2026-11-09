import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle2, Clock, Users, Award, AlertCircle, RefreshCw,
  Search, Eye, TrendingUp, Calendar, Mail
} from 'lucide-react';

export default function ExamSubmissionsViewerModal({
  isOpen,
  assignment,
  onClose,
  authToken,
  onViewStudentDetail = null
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submitted'); // 'submitted' | 'unsubmitted'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && assignment) {
      fetchSubmissions();
      setActiveTab('submitted');
      setSearchQuery('');
    }
  }, [isOpen, assignment]);

  const fetchSubmissions = async () => {
    if (!assignment) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/exam-assignments/${assignment.id}/submissions`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !assignment) return null;

  const submissions = data?.submissions || [];
  const unsubmitted = data?.unsubmitted_students || [];

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.student_name && s.student_name.toLowerCase().includes(q)) ||
      (s.student_email && s.student_email.toLowerCase().includes(q))
    );
  });

  // Filtered unsubmitted
  const filteredUnsubmitted = unsubmitted.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.full_name && s.full_name.toLowerCase().includes(q)) ||
      (s.username && s.username.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  // Analytics stats
  const avgScore = submissions.length > 0
    ? (submissions.reduce((acc, s) => acc + Number(s.score), 0) / submissions.length).toFixed(1)
    : 0;

  const maxScore = submissions.length > 0
    ? Math.max(...submissions.map((s) => Number(s.score)))
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in text-slate-100">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] border-b border-amber-300/30 flex items-center justify-between gap-4 shrink-0 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 text-[#FDE2A7] border border-amber-300/40 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[#FDE2A7] border border-amber-300/40 text-[10px] font-bold uppercase">
                  Bảng điểm đề thi
                </span>
                <span className="text-xs text-[#FFF7E8]/80 font-mono">#{assignment.id}</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white mt-0.5 font-serif-royal">
                {assignment.title}
              </h3>
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

        {/* Quick KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-950/40 border-b border-slate-800 shrink-0 text-xs">
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Đã nộp bài</span>
            <span className="text-lg font-black text-emerald-400 mt-0.5 block">
              {submissions.length} / {data?.assignment?.total_assigned || 0}
            </span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Chưa hoàn thành</span>
            <span className="text-lg font-black text-amber-400 mt-0.5 block">
              {unsubmitted.length}
            </span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Điểm trung bình</span>
            <span className="text-lg font-black text-gold mt-0.5 block">
              {avgScore} / 10
            </span>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Điểm cao nhất</span>
            <span className="text-lg font-black text-white mt-0.5 block">
              {maxScore} / 10
            </span>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('submitted')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'submitted'
                  ? 'bg-[#850B10] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đã nộp bài ({submissions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('unsubmitted')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'unsubmitted'
                  ? 'bg-[#850B10] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Chưa làm ({unsubmitted.length})</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-gold" />
              <span>Đang tải bảng điểm học sinh...</span>
            </div>
          ) : activeTab === 'submitted' ? (
            filteredSubmissions.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                Chưa có học sinh nào nộp bài thi này.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Học sinh</th>
                      <th className="py-3 px-4 text-center">Điểm số</th>
                      <th className="py-3 px-4 text-center">Số câu đúng</th>
                      <th className="py-3 px-4 text-center">Thời gian làm</th>
                      <th className="py-3 px-4">Ngày nộp</th>
                      <th className="py-3 px-4 text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredSubmissions.map((sub, idx) => {
                      const scoreNum = Number(sub.score);
                      const scoreBadgeColor =
                        scoreNum >= 8.5
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : scoreNum >= 6.5
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : scoreNum >= 5.0
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800';

                      const minutes = Math.floor(sub.time_spent_seconds / 60);
                      const seconds = sub.time_spent_seconds % 60;

                      return (
                        <tr key={sub.id} className="hover:bg-slate-800/50 transition">
                          <td className="py-3 px-4 font-mono text-slate-500">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-white text-xs">{sub.student_name}</div>
                            {sub.student_email && (
                              <div className="text-[11px] text-slate-500 font-mono">{sub.student_email}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black border ${scoreBadgeColor}`}>
                              {scoreNum.toFixed(1)} / 10
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-200">
                            {sub.correct_count} / {sub.total_questions}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-400">
                            {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
                          </td>
                          <td className="py-3 px-4 text-[11px] font-mono text-slate-400">
                            {new Date(sub.submitted_at).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {onViewStudentDetail && (
                              <button
                                onClick={() => onViewStudentDetail(sub, assignment)}
                                className="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-amber-300 hover:text-slate-950 font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                                title="Xem bài làm của học sinh"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem bài</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            filteredUnsubmitted.length === 0 ? (
              <div className="py-16 text-center text-xs text-emerald-400 font-bold flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8" />
                <span>Tuyệt vời! 100% học sinh được giao đã hoàn thành nộp bài.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredUnsubmitted.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3 text-xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {st.full_name ? st.full_name[0].toUpperCase() : 'H'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-white truncate">{st.full_name || st.username}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">@{st.username}</div>
                      <span className="inline-block mt-1 text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/80">
                        Chưa nộp bài
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

