import React, { useState, useEffect } from 'react';
import {
  Sparkles, RotateCcw, CheckCircle2, XCircle, HelpCircle,
  Eye, Check, ChevronRight, Lock, Unlock, Play, Flame
} from 'lucide-react';

export default function TilePuzzleGame({
  resourceId,
  resourceImg,
  resourceTitle,
  initialQuizzes = []
}) {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [unlockedTiles, setUnlockedTiles] = useState([false, false, false, false]);
  const [activeTileIndex, setActiveTileIndex] = useState(null); // 0, 1, 2, 3 or null
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerResult, setAnswerResult] = useState(null); // 'correct' | 'wrong' | null
  const [streakCount, setStreakCount] = useState(0);

  // Load game quizzes for this resource
  useEffect(() => {
    if (!resourceId) return;

    setLoading(true);
    fetch(`/api/resources/${resourceId}/game-quizzes`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tải được câu hỏi trò chơi');
        return res.json();
      })
      .then((data) => {
        setGameData(data);
        setUnlockedTiles([false, false, false, false]);
      })
      .catch((err) => {
        console.warn('Fallback to local quizzes for game:', err);
        // Fallback using initialQuizzes if available
        if (initialQuizzes && initialQuizzes.length >= 4) {
          setGameData({
            resource_id: resourceId,
            title: resourceTitle,
            game_image: resourceImg,
            quizzes: initialQuizzes.slice(0, 4).map((q, idx) => ({
              id: q.id,
              tile_number: idx + 1,
              tile_label: `0${idx + 1}`,
              question: q.question,
              options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
              correct_index: q.correct_index,
              explanation: q.explanation || 'Chính xác! Bạn đã mở được một ô tranh bí ẩn.'
            }))
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [resourceId, resourceImg, resourceTitle]);

  const quizzes = gameData?.quizzes || [];
  const secretImage = gameData?.game_image || resourceImg;

  const totalTiles = 4;
  const openedCount = unlockedTiles.filter(Boolean).length;
  const isGameWon = openedCount === totalTiles;

  // Open question modal for a tile
  const handleTileClick = (index) => {
    if (unlockedTiles[index]) return; // already opened
    if (!quizzes[index]) return;

    setActiveTileIndex(index);
    setSelectedOption(null);
    setAnswerResult(null);
  };

  // Submit answer
  const handleSelectOption = (optIdx) => {
    if (answerResult === 'correct') return;

    setSelectedOption(optIdx);
    const activeQuiz = quizzes[activeTileIndex];
    if (!activeQuiz) return;

    if (optIdx === activeQuiz.correct_index) {
      setAnswerResult('correct');
      setStreakCount((prev) => prev + 1);

      // Play short chime or delay then unlock tile
      setTimeout(() => {
        setUnlockedTiles((prev) => {
          const next = [...prev];
          next[activeTileIndex] = true;
          return next;
        });
        setActiveTileIndex(null);
        setSelectedOption(null);
        setAnswerResult(null);
      }, 1200);
    } else {
      setAnswerResult('wrong');
    }
  };

  // Restart game
  const handleResetGame = () => {
    setUnlockedTiles([false, false, false, false]);
    setActiveTileIndex(null);
    setSelectedOption(null);
    setAnswerResult(null);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Đang nạp trò chơi Lật ô chữ...</span>
        </div>
      </div>
    );
  }

  if (quizzes.length < 4) {
    return null; // Not enough quizzes to form the 4-quadrant game
  }

  const activeQuiz = activeTileIndex !== null ? quizzes[activeTileIndex] : null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
      {/* Header (Matching User Attachment text) */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#850B10] text-[#FFFDF8] shadow-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Trò Chơi Tương Tác Học Tập</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-royal uppercase tracking-tight">
          Lật Ô Chữ — Khám Phá Bức Tranh Bí Ẩn
        </h3>

        {/* The Exact Instruction from User Attachment */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Người chơi trả lời các câu hỏi mà ô chữ đặt ra nhằm tìm ra bức hình ẩn sau các ô chữ.
        </p>

        {/* Progress & Reset Bar */}
        <div className="pt-2 flex items-center justify-center gap-4 text-xs">
          <span
            className={`font-bold px-3.5 py-1.5 rounded-full border transition-all ${
              isGameWon
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isGameWon ? (
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã giải mã thành công toàn bộ bức tranh ({openedCount}/{totalTiles} ô)</span>
              </span>
            ) : (
              <span>
                Tiến độ: <strong className="text-[#EE6C52]">{openedCount}</strong> / {totalTiles} ô
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={handleResetGame}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-[#850B10] font-semibold border border-slate-200 hover:border-amber-300 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Chơi lại</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* THE 4-TILE GAME BOARD (2x2 Grid Matching User Screenshot)       */}
      {/* ============================================================== */}
      <div className="relative max-w-xl mx-auto aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200/80 bg-slate-900 select-none">
        {/* Layer 1: Secret Mystery Picture in background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={secretImage}
            alt={resourceTitle || 'Bức tranh bí ẩn'}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isGameWon ? 'scale-105' : 'scale-100'
            }`}
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* Layer 2: The 4 Quadrant Covering Tiles (2x2 Grid) */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-2 sm:p-3.5 gap-2 sm:gap-3.5 pointer-events-none">
          {quizzes.map((quiz, idx) => {
            const isUnlocked = unlockedTiles[idx];
            const tileLabel = `0${idx + 1}`;

            return (
              <div
                key={quiz.id || idx}
                onClick={() => handleTileClick(idx)}
                className={`relative rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-700 transform-gpu ${
                  isUnlocked
                    ? 'opacity-0 scale-90 pointer-events-none rotate-6'
                    : 'opacity-100 scale-100 pointer-events-auto cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95'
                }`}
                style={{
                  backgroundColor: '#EE6C52', // Exact coral-salmon tone in user screenshot
                  boxShadow: isUnlocked ? 'none' : '0 10px 25px -5px rgba(238, 108, 82, 0.4)'
                }}
              >
                {/* Tile Content */}
                {!isUnlocked && (
                  <div className="flex flex-col items-center justify-center text-center p-2 select-none group">
                    <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                      {tileLabel}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Nhấn để mở ô
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* All tiles unlocked: clean, unobstructed image view */}
      </div>

      {/* Optional caption below board when all tiles are revealed */}
      {isGameWon && resourceTitle && (
        <div className="text-center pt-1 animate-fade-in">
          <p className="text-sm sm:text-base font-bold text-slate-800 font-serif-royal">
            {resourceTitle}
          </p>
        </div>
      )}

      {/* ============================================================== */}
      {/* INTERACTIVE QUESTION MODAL (When clicking an unopened tile)     */}
      {/* ============================================================== */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-amber-200/80 space-y-5 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#EE6C52] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {`0${activeTileIndex + 1}`}
                </span>
                <div>
                  <h4 className="font-black text-base text-slate-900">
                    Câu hỏi mở ô chữ số 0{activeTileIndex + 1}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Chọn đáp án đúng để lật mở góc tranh bí ẩn
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTileIndex(null);
                  setSelectedOption(null);
                  setAnswerResult(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
              <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                {activeQuiz.question}
              </p>
            </div>

            {/* Multiple Choice Options (A, B, C, D) */}
            <div className="space-y-2.5">
              {activeQuiz.options?.map((option, optIdx) => {
                const label = ['A', 'B', 'C', 'D'][optIdx] || `${optIdx + 1}`;
                const isSelected = selectedOption === optIdx;
                const isCorrect = answerResult === 'correct' && isSelected;
                const isWrong = answerResult === 'wrong' && isSelected;

                let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-500/30';
                } else if (isWrong) {
                  btnStyle = 'bg-rose-50 text-rose-900 border-rose-500 ring-2 ring-rose-500/30 animate-shake';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={answerResult === 'correct'}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrong
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}>
                      {label}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {isWrong && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {answerResult === 'correct' && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>🎉 Chính xác! Ô chữ số 0{activeTileIndex + 1} đang được lật mở...</span>
              </div>
            )}

            {answerResult === 'wrong' && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>❌ Chưa chính xác! Hãy đọc kỹ và thử chọn lại đáp án khác nhé.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

