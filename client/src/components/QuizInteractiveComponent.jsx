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
      <div className="bg-gradient-to-br from-slate-900 via-navy-dark to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-xl space-y-6 animate-fade-in text-center">
        <div className="w-16 h-16 rounded-3xl bg-gold/20 border border-gold/40 text-gold mx-auto flex items-center justify-center font-black">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-gold-light">
            Hoàn Thành Bài Trắc Nghiệm Năng Lực
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-1 text-white">
            {title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Score Card */}
        <div className="inline-flex items-center gap-6 p-4 px-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Số câu chính xác</span>
            <strong className="text-3xl font-black text-gold">
              {score} <span className="text-base text-slate-300 font-normal">/ {total}</span>
            </strong>
          </div>
          <div className="w-px h-10 bg-white/15" />
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Tỷ lệ hoàn thành</span>
            <strong className="text-3xl font-black text-emerald-400">
              {percent}%
            </strong>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-black text-xs transition shadow-md active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm Lại Bài Này</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 relative overflow-hidden animate-fade-in">
      {/* Top Banner & Progress */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gold/15 text-navy border border-gold/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              <span>Thử Thách Trắc Nghiệm GDPT 2018</span>
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${diffBadge.color}`}>
              {diffBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-slate-700">
              Câu <strong className="text-gold-dark">{currentIndex + 1}</strong> / {total}
            </span>

            {/* Admin Quick Edit Tools */}
            {isAdmin && (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                {onEditQuiz && (
                  <button
                    onClick={() => onEditQuiz(currentQuiz)}
                    title="Chỉnh sửa câu hỏi này (Admin)"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-gold/30 text-slate-700 hover:text-slate-950 transition border border-slate-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDeleteQuiz && (
                  <button
                    onClick={() => onDeleteQuiz(currentQuiz.id, currentQuiz.question)}
                    title="Xóa câu hỏi này (Admin)"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition border border-slate-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onAddQuiz && (
                  <button
                    onClick={onAddQuiz}
                    title="Thêm câu hỏi mới cho bài này (Admin)"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition border border-slate-200"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-gold to-amber-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
          {currentQuiz.question}
        </h3>
        {currentQuiz.lesson && (
          <span className="text-[11px] font-bold text-slate-400 mt-1 block">
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

          let btnClass = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';
          let letterClass = 'bg-slate-200 text-slate-700';

          if (hasAnswered) {
            if (isCorrect) {
              btnClass = 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-sm ring-1 ring-emerald-300';
              letterClass = 'bg-emerald-500 text-white font-black';
            } else if (isSelected && !isCorrect) {
              btnClass = 'bg-rose-50 text-rose-950 border-rose-300 ring-1 ring-rose-200';
              letterClass = 'bg-rose-500 text-white font-black';
            } else {
              btnClass = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
              letterClass = 'bg-slate-200 text-slate-400';
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
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition ${letterClass}`}>
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
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 animate-fade-in text-xs">
          <div className="flex items-center gap-2 font-black text-amber-900 text-xs">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Giải Mã Kiến Thức Lịch Sử:</span>
          </div>
          <p className="text-slate-700 leading-relaxed font-normal pl-6 whitespace-pre-line">
            {currentQuiz.explanation || 'Đáp án chính xác được xây dựng trên cơ sở các nguồn tư liệu khảo cổ và giáo trình Lịch sử 10 GDPT 2018.'}
          </p>

          <div className="pt-3 flex items-center justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white font-black text-xs transition shadow-md active:scale-95"
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

