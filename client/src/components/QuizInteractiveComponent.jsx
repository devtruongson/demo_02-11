import React, { useState, useEffect } from 'react';
import {
  Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb,
  Sparkles, ShieldCheck, Edit3, Trash2, PlusCircle, HelpCircle, BookOpen
} from 'lucide-react';

export default function QuizInteractiveComponent({
  quizzes = [],
  lessonTitle = '',
  isAdmin = false,
  onEditQuiz = null,
  onDeleteQuiz = null,
  onAddQuiz = null,
  onRefresh = null
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    // Reset when quiz list changes
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
  }, [quizzes]);

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold border border-gold/30 mx-auto flex items-center justify-center font-bold">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h4 className="font-extrabold text-base text-slate-800">
          Chưa có câu hỏi trắc nghiệm cho bài học này
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Hệ thống đang tiếp tục cập nhật ngân hàng câu hỏi đánh giá năng lực theo chuẩn GDPT 2018 cho chuyên đề này.
        </p>
        {isAdmin && onAddQuiz && (
          <button
            onClick={onAddQuiz}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-black text-xs transition shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm câu hỏi đầu tiên</span>
          </button>
        )}
      </div>
    );
  }

  const currentQuiz = quizzes[currentIndex];
  const total = quizzes.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'nhan_biet':
        return { label: 'Cấp độ 1: Nhận biết', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'thong_hieu':
        return { label: 'Cấp độ 2: Thông hiểu', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'van_dung':
        return { label: 'Cấp độ 3: Vận dụng', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'van_dung_cao':
        return { label: 'Cấp độ 4: Vận dụng cao', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Trắc nghiệm đánh giá', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return; // Locked once answered
    setSelectedOption(idx);

    const isCorrect = idx === currentQuiz.correct_index;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuiz.id,
        selected: idx,
        correct: currentQuiz.correct_index,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
  };

  const diffBadge = getDifficultyBadge(currentQuiz.difficulty);

  // Result screen when user completes all questions
  if (isFinished) {
    const percent = Math.round((score / total) * 100);
    let title = '';
    let subtitle = '';
    if (percent === 100) {
      title = '🏆 Xuất Sắc! Bạn Là Nhà Sử Học Tài Ba';
      subtitle = 'Bạn đã trả lời chính xác toàn bộ câu hỏi và nắm vững 100% bản chất tư liệu của bài học này!';
    } else if (percent >= 70) {
      title = '🎉 Rất Tốt! Kiến Thức Vững Vàng';
      subtitle = 'Bạn đã hiểu sâu sắc nội dung chuyên đề. Hãy xem lại những điểm cần bổ sung để đạt điểm tuyệt đối nhé.';
    } else {
      title = '💪 Cố Lên! Tiếp Tục Khám Phá';
      subtitle = 'Hãy quan sát lại các hiện vật 3D và đọc kỹ phần giải mã sử liệu để làm lại đạt kết quả cao hơn!';
    }

    return (
      <div className="bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] text-white rounded-3xl p-6 sm:p-10 border border-amber-300/30 shadow-xl space-y-6 animate-fade-in text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 w-16 h-16 rounded-3xl bg-white/15 border border-amber-300/40 text-[#FDE2A7] mx-auto flex items-center justify-center font-bold">
          <Award className="w-8 h-8" />
        </div>

        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FDE2A7]">
            Hoàn Thành Bài Trắc Nghiệm Năng Lực
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-white font-serif-royal">
            {title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#FFF7E8]/90 max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Score Card */}
        <div className="relative z-10 inline-flex items-center gap-6 p-4 px-8 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20">
          <div>
            <span className="text-[10px] text-[#FFF7E8]/80 block font-bold uppercase">Số câu chính xác</span>
            <strong className="text-3xl font-bold text-[#FDE2A7]">
              {score} <span className="text-base text-[#FFF7E8]/70 font-normal">/ {total}</span>
            </strong>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <span className="text-[10px] text-[#FFF7E8]/80 block font-bold uppercase">Tỷ lệ hoàn thành</span>
            <strong className="text-3xl font-bold text-emerald-400">
              {percent}%
            </strong>
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFDF5] hover:bg-[#FAF5EB] text-[#850B10] font-bold text-xs transition shadow-md active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#850B10]" />
            <span>Làm Lại Bài Này</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 border border-[#EBDBC5] shadow-xs space-y-6 relative overflow-hidden animate-fade-in">
      {/* Top Banner & Progress */}
      <div className="space-y-3 pb-4 border-b border-[#EBDBC5]/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-[#850B10] border border-amber-300/50">
              <Sparkles className="w-3.5 h-3.5 text-[#850B10]" />
              <span>Thử Thách Trắc Nghiệm GDPT 2018</span>
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${diffBadge.color}`}>
              {diffBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#2D1B08]">
              Câu <strong className="text-[#850B10]">{currentIndex + 1}</strong> / {total}
            </span>

            {/* Admin Quick Edit Tools */}
            {isAdmin && (
              <div className="flex items-center gap-1 pl-2 border-l border-[#EBDBC5]">
                {onEditQuiz && (
                  <button
                    onClick={() => onEditQuiz(currentQuiz)}
                    title="Chỉnh sửa câu hỏi này (Admin)"
                    className="p-1.5 rounded-lg bg-[#FAF5EB] hover:bg-amber-100 text-stone-700 hover:text-[#850B10] transition border border-[#EBDBC5]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDeleteQuiz && (
                  <button
                    onClick={() => onDeleteQuiz(currentQuiz.id, currentQuiz.question)}
                    title="Xóa câu hỏi này (Admin)"
                    className="p-1.5 rounded-lg bg-[#FAF5EB] hover:bg-rose-100 text-stone-700 hover:text-rose-600 transition border border-[#EBDBC5]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onAddQuiz && (
                  <button
                    onClick={onAddQuiz}
                    title="Thêm câu hỏi mới cho bài này (Admin)"
                    className="p-1.5 rounded-lg bg-[#FAF5EB] hover:bg-emerald-100 text-stone-700 hover:text-emerald-700 transition border border-[#EBDBC5]"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#FAF5EB] border border-[#EBDBC5] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-[#850B10] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-[#2D1B08] leading-snug">
          {currentQuiz.question}
        </h3>
        {currentQuiz.lesson && (
          <span className="text-[11px] font-medium text-stone-500 mt-1 block">
            Thuộc bài: {currentQuiz.lesson}
          </span>
        )}
      </div>

      {/* 4 Option Buttons */}
      <div className="space-y-3">
        {currentQuiz.options && currentQuiz.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQuiz.correct_index;
          const hasAnswered = selectedOption !== null;

          let btnClass = 'bg-[#FAF5EB] hover:bg-[#FFFDF5] text-[#2D1B08] border-[#EBDBC5]';
          let letterClass = 'bg-[#EBDBC5] text-[#850B10] font-bold';

          if (hasAnswered) {
            if (isCorrect) {
              btnClass = 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-sm ring-1 ring-emerald-300';
              letterClass = 'bg-emerald-600 text-white font-bold';
            } else if (isSelected && !isCorrect) {
              btnClass = 'bg-rose-50 text-rose-950 border-rose-300 ring-1 ring-rose-200';
              letterClass = 'bg-rose-600 text-white font-bold';
            } else {
              btnClass = 'bg-[#FAF5EB] text-stone-400 border-[#EBDBC5] opacity-60';
              letterClass = 'bg-[#EBDBC5] text-stone-400';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={hasAnswered}
              className={`w-full p-4 rounded-2xl border text-left font-medium text-xs sm:text-sm flex items-start gap-3 transition-all duration-200 ${btnClass} ${
                !hasAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
              }`}
            >
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition ${letterClass}`}>
                {letter}
              </span>
              <span className="flex-1 pt-1 leading-relaxed">
                {opt}
              </span>
              {hasAnswered && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {hasAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box (Shown once answered) */}
      {selectedOption !== null && (
        <div className="p-5 rounded-2xl bg-[#FAF5EB] border border-amber-300/70 space-y-2 animate-fade-in text-xs">
          <div className="flex items-center gap-2 font-bold text-[#850B10] text-xs">
            <Lightbulb className="w-4 h-4 text-[#850B10]" />
            <span>Giải Mã Kiến Thức Lịch Sử:</span>
          </div>
          <p className="text-stone-700 leading-relaxed font-normal pl-6 whitespace-pre-line">
            {currentQuiz.explanation || 'Đáp án chính xác được xây dựng trên cơ sở các nguồn tư liệu khảo cổ và giáo trình Lịch sử 10 GDPT 2018.'}
          </p>

          <div className="pt-3 flex items-center justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white font-bold text-xs transition shadow-md active:scale-95 cursor-pointer"
            >
              <span>{currentIndex < total - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

