import React, { useState, useEffect, useRef } from 'react';
import {
  X, Clock, CheckCircle2, AlertCircle, Award, ChevronLeft, ChevronRight,
  Send, HelpCircle, BookOpen, Sparkles, RefreshCw, Check, ArrowRight
} from 'lucide-react';

export default function ExamTakingModal({
  isOpen,
  assignmentId,
  mode = 'take', // 'take' | 'review'
  studentId = null, // for review mode if teacher is viewing
  onClose,
  onCompleted,
  authToken
}) {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Exam Data
  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  // Student taking state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [question_id]: option_index }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Result / Review Data
  const [resultData, setResultData] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (isOpen && assignmentId) {
      if (mode === 'take') {
        loadExamForTaking();
      } else {
        loadExamResult();
      }
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen, assignmentId, mode]);

  // Load Exam for student to take
  const loadExamForTaking = async () => {
    setLoading(true);
    setErrorMsg('');
    setAnswers({});
    setCurrentIdx(0);
    setResultData(null);
    try {
      const res = await fetch(`/api/exam-assignments/${assignmentId}/take`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.already_submitted) {
          // Already submitted, switch to review mode
          await loadExamResult();
          return;
        }
        throw new Error(data.error || 'Lỗi khi tải bài thi');
      }

      setAssignment(data.assignment);
      setQuestions(data.questions || []);

      const durationSeconds = (data.assignment.duration_minutes || 15) * 60;
      setTimeLeft(durationSeconds);
      startTimeRef.current = Date.now();

      // Start countdown
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Auto submit when time is up
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load completed exam result
  const loadExamResult = async () => {
    setLoading(true);
    setErrorMsg('');
    clearInterval(timerRef.current);
    try {
      const url = studentId
        ? `/api/exam-assignments/${assignmentId}/result?student_id=${studentId}`
        : `/api/exam-assignments/${assignmentId}/result`;

      const res = await fetch(url, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi tải kết quả bài thi');
      }

      setAssignment(data.assignment);
      setResultData(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (resultData) return; // Read-only in result mode
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleAutoSubmit = async () => {
    alert('Đã hết thời gian làm bài! Hệ thống đang tự động nộp bài thi của bạn.');
    await doSubmitExam();
  };

  const doSubmitExam = async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    setErrorMsg('');
    setShowConfirmModal(false);

    const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    try {
      const res = await fetch(`/api/exam-assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          answers,
          time_spent_seconds: timeSpent
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi nộp bài thi');
      }

      setResultData({
        assignment,
        submission: {
          score: data.score,
          correct_count: data.correct_count,
          total_questions: data.total_questions,
          time_spent_seconds: data.time_spent_seconds
        },
        review: data.review
      });

      if (onCompleted) {
        onCompleted(data);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeLeft < 60;

  // Format mm:ss
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in text-slate-100">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[94vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* ================= EXAM TOPBAR ================= */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-black text-sm shrink-0">
              📝
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-base text-white truncate max-w-sm sm:max-w-md">
                {assignment?.title || 'Phòng Thi Trắc Nghiệm'}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{assignment?.created_by_name || 'Hội đồng Sư phạm'}</span>
                <span>•</span>
                <span>Tổng {questions.length || resultData?.review?.length || 0} câu hỏi</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Real-time Countdown Timer (Only in Take mode) */}
            {!resultData && (
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-black ${
                  isTimeCritical
                    ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                    : 'bg-slate-900 text-gold border-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}

            {!resultData ? (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Nộp bài</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Đóng
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= MAIN EXAM BODY ================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-slate-400 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-gold" />
              <span>Đang tải đề thi và câu hỏi khảo sát...</span>
            </div>
          ) : errorMsg && !resultData ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-rose-400 gap-2">
              <AlertCircle className="w-8 h-8 text-rose-500" />
              <span className="font-bold">{errorMsg}</span>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-white font-bold"
              >
                Quay lại
              </button>
            </div>
          ) : resultData ? (
            /* ================= MODE: RESULT & REVIEW ================= */
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {/* Score Highlight Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-navy via-slate-900 to-navy-dark border border-gold/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-black uppercase tracking-wider border border-gold/30">
                    <Award className="w-3.5 h-3.5" />
                    <span>Kết Quả Bài Kiểm Tra</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {resultData.submission?.student_name ? `Học sinh: ${resultData.submission.student_name}` : 'Hoàn Thành Bài Thi'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Làm đúng {resultData.submission?.correct_count} / {resultData.submission?.total_questions} câu hỏi
                    {resultData.submission?.time_spent_seconds > 0 && (
                      <> • Thời gian: {Math.floor(resultData.submission.time_spent_seconds / 60)}m {resultData.submission.time_spent_seconds % 60}s</>
                    )}
                  </p>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[140px]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Điểm số</span>
                  <div className="text-3xl sm:text-4xl font-black text-gold my-0.5">
                    {Number(resultData.submission?.score || 0).toFixed(1)}
                  </div>
                  <span className="text-[10px] text-slate-400">Thang điểm 10</span>
                </div>
              </div>

              {/* Review List of Questions */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>Chi tiết câu trả lời & Lời giải học thuật:</span>
                </h4>

                {resultData.review?.map((rev, qIdx) => {
                  return (
                    <div
                      key={rev.id || qIdx}
                      className={`p-5 rounded-2xl border transition space-y-3 ${
                        rev.is_correct
                          ? 'bg-slate-900/90 border-emerald-900/80'
                          : 'bg-slate-900/90 border-rose-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono font-black text-gold">
                            Câu {qIdx + 1}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{rev.lesson}</span>
                        </div>
                        {rev.is_correct ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Đúng (+{((10 / (resultData.review.length || 1))).toFixed(1)}đ)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-800">
                            <X className="w-3 h-3 text-rose-400" />
                            Chưa chính xác (0đ)
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                        {rev.question}
                      </p>

                      {/* Options Review */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {rev.options?.map((opt, optIdx) => {
                          const isUserAnswer = rev.user_answer === optIdx;
                          const isCorrectAnswer = rev.correct_index === optIdx;

                          let badgeStyle = 'bg-slate-950/60 border-slate-800 text-slate-400';
                          if (isCorrectAnswer) {
                            badgeStyle = 'bg-emerald-950/70 border-emerald-600 text-emerald-200 font-bold';
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            badgeStyle = 'bg-rose-950/70 border-rose-600 text-rose-200 line-through';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${badgeStyle}`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono font-black text-xs shrink-0">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span className="truncate">{opt}</span>
                              </div>
                              {isCorrectAnswer && (
                                <span className="text-[10px] font-black text-emerald-400 shrink-0">
                                  ✓ Đáp án đúng
                                </span>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <span className="text-[10px] font-black text-rose-400 shrink-0">
                                  ✗ Bạn đã chọn
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      {rev.explanation && (
                        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-200/90 space-y-1">
                          <strong className="text-amber-400 block font-bold">💡 Hướng dẫn & Giải thích:</strong>
                          <p className="leading-relaxed">{rev.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ================= MODE: TAKING EXAM ================= */
            <>
              {/* Question Navigation Palette (Left column / Mobile top) */}
              <div className="w-full md:w-60 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-4 overflow-y-auto shrink-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-black text-slate-400 uppercase tracking-wider text-[10px]">
                      Danh sách câu hỏi
                    </span>
                    <span className="text-[11px] font-mono font-bold text-gold">
                      {answeredCount} / {questions.length} đã làm
                    </span>
                  </div>

                  {/* Palette Grid */}
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 gap-2">
                    {questions.map((q, idx) => {
                      const isAnswered = answers[q.id] !== undefined;
                      const isCurrent = currentIdx === idx;

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setCurrentIdx(idx)}
                          className={`h-9 rounded-xl font-mono text-xs font-black transition relative flex items-center justify-center cursor-pointer ${
                            isCurrent
                              ? 'ring-2 ring-gold bg-slate-800 text-white shadow-md'
                              : isAnswered
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          <span>{idx + 1}</span>
                          {isAnswered && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 hidden md:block">
                  <div className="text-[11px] text-slate-400 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-emerald-950 border border-emerald-700" />
                      <span>Đã chọn đáp án</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md ring-2 ring-gold bg-slate-800" />
                      <span>Câu đang xem</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Question Display (Right Column) */}
              {currentQ && (
                <div className="flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-5">
                    {/* Question Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-gold text-slate-950 font-black text-xs font-mono">
                          Câu {currentIdx + 1} / {questions.length}
                        </span>
                        <span className="text-xs text-slate-400 font-medium line-clamp-1">
                          {currentQ.lesson}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">ID: #{currentQ.id}</span>
                    </div>

                    {/* Question Text */}
                    <div className="bg-slate-950 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-sm">
                      <h3 className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
                        {currentQ.question}
                      </h3>
                    </div>

                    {/* Option Cards A, B, C, D */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Chọn một đáp án đúng nhất:
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {Array.isArray(currentQ.options) &&
                          currentQ.options.map((opt, optIdx) => {
                            const isSelected = answers[currentQ.id] === optIdx;
                            return (
                              <div
                                key={optIdx}
                                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                                className={`p-4 rounded-2xl border transition flex items-center gap-3.5 cursor-pointer select-none ${
                                  isSelected
                                    ? 'bg-gold/15 border-gold text-white shadow-md ring-1 ring-gold/50'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 border transition ${
                                    isSelected
                                      ? 'bg-gold text-slate-950 border-gold'
                                      : 'bg-slate-900 text-slate-400 border-slate-700'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className="text-xs sm:text-sm font-semibold leading-relaxed flex-1">
                                  {opt}
                                </span>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-gold text-slate-950 flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Câu trước</span>
                    </button>

                    {currentIdx < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95"
                      >
                        <span>Câu tiếp theo</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowConfirmModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-sm active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Xem lại & Nộp bài</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ================= CONFIRM SUBMIT MODAL ================= */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-gold/20 text-gold border border-gold/40 flex items-center justify-center mx-auto text-2xl font-bold">
                📋
              </div>

              <div>
                <h4 className="text-lg font-black text-white">Xác Nhận Nộp Bài Thi</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Bạn đã làm <strong className="text-gold">{answeredCount}</strong> / {questions.length} câu hỏi.
                </p>
                {answeredCount < questions.length && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-xs text-amber-300 font-bold">
                    ⚠️ Chú ý: Bạn vẫn còn {questions.length - answeredCount} câu hỏi chưa trả lời!
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Tiếp tục làm bài
                </button>
                <button
                  type="button"
                  onClick={doSubmitExam}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-md active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Đang chấm điểm...' : 'Xác nhận nộp'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

