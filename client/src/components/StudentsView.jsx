import React, { useState } from 'react';
import { useParams, NavLink, Link } from 'react-router-dom';
import { Users, Award, CheckCircle, HelpCircle, BookOpen, Sparkles, Box, Compass, ArrowRight } from 'lucide-react';

export default function StudentsView() {
  const { tab = 'nhiem-vu' } = useParams();

  const studentTabs = [
    { to: '/hoc-sinh/nhiem-vu', id: 'nhiem-vu', label: 'Nhiệm Vụ Học Tập & Phương Pháp', icon: BookOpen },
    { to: '/hoc-sinh/luyen-tap-trac-nghiem', id: 'luyen-tap-trac-nghiem', label: 'Thử Thách Trắc Nghiệm', icon: Award },
  ];

  const [activeQuiz, setActiveQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const quizzes = [
    {
      question: 'Cảng thị quốc tế cổ đại nào sau đây từng thuộc Vương quốc Phù Nam?',
      options: ['Hội An', 'Óc Eo (An Giang)', 'Vân Đồn', 'Malacca'],
      correct: 1,
      explanation: 'Thương cảng Óc Eo (Ba Thê, An Giang) là trung tâm giao thương sầm uất bậc nhất của Vương quốc Phù Nam, kết nối tàu buôn La Mã, Ấn Độ và Trung Hoa.'
    },
    {
      question: 'Bia đá cổ nhất được tìm thấy ở Đông Nam Á khắc bằng chữ gì?',
      options: ['Chữ Nôm', 'Chữ Phạn (Sanskrit) trên bia Võ Cạnh', 'Chữ Latinh', 'Chữ Hán cổ'],
      correct: 1,
      explanation: 'Bia Võ Cạnh (Nha Trang, Khánh Hòa) niên đại thế kỷ II – III là bản khắc chữ Phạn Sanskrit cổ nhất được phát hiện tại Đông Nam Á.'
    },
    {
      question: 'Quần thể đền tháp nào được xem là biểu tượng kiến trúc Phật giáo vĩ đại nhất thế giới?',
      options: ['Angkor Wat', 'Borobudur (Indonesia)', 'Thánh địa Mỹ Sơn', 'Chùa Vàng Shwedagon'],
      correct: 1,
      explanation: 'Đền tháp Borobudur tại đảo Java (Indonesia) với 9 tầng và hàng trăm tượng Phật là kỳ quan Phật giáo lớn nhất thế giới.'
    },
    {
      question: 'Hiện vật nào là biểu tượng đỉnh cao của nền văn minh sông Hồng thời đại dựng nước?',
      options: ['Bình gốm Bản Chiềng', 'Trống đồng Ngọc Lũ (Văn hóa Đông Sơn)', 'Đài thờ Mỹ Sơn E1', 'Tượng Phật Wat Muang'],
      correct: 1,
      explanation: 'Trống đồng Ngọc Lũ là Bảo vật Quốc gia số 1, minh chứng cho kỹ thuật đúc đồng và đời sống cư dân Việt cổ thời kỳ Văn Lang – Âu Lạc.'
    }
  ];

  const handleSelect = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === quizzes[activeQuiz].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (activeQuiz < quizzes.length - 1) {
      setActiveQuiz(activeQuiz + 1);
    } else {
      alert(`Chúc mừng bạn đã hoàn thành bài thử thách với số điểm: ${score + (selectedAnswer === quizzes[activeQuiz].correct ? 0 : 0)} / ${quizzes.length}!`);
      setActiveQuiz(0);
      setScore(0);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-navy-dark via-navy to-[#223968] text-white p-8 rounded-3xl shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold/20 text-gold-light border border-gold/30 mb-3">
            <Users className="w-4 h-4" /> Góc Tự Học & Khám Phá Của Học Sinh
          </div>
          <h2 className="text-3xl font-black tracking-tight">
            Khám Phá Lịch Sử 10 Trực Quan & Thú Vị
          </h2>
          <p className="mt-2 text-slate-200 text-sm leading-relaxed max-w-xl">
            Không còn những trang sách khô khan. Hãy tự mình tương tác với các cổ vật 3D, đọc những câu chuyện lịch sử đằng sau mỗi bảo vật và thử thách kiến thức của bản thân.
          </p>

          {/* Sub-Tab Navigation with Slugs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/15">
            {studentTabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <NavLink
                  key={t.to}
                  to={t.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-gold text-slate-950 shadow-md font-black'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <Link
            to="/studio-3d"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gold hover:bg-gold-dark text-slate-950 font-bold text-xs transition shadow active:scale-95"
          >
            <Box className="w-4 h-4" />
            <span>Mở Studio 3D Ngay</span>
          </Link>
          <Link
            to="/kho-tu-lieu"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tra Cứu Kho Tư Liệu</span>
          </Link>
        </div>
      </div>

      {/* TAB 1: NHIỆM VỤ HỌC TẬP */}
      {tab === 'nhiem-vu' && (
        <div className="space-y-6">
          {/* 3 Step Discovery Method */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                B1
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Quan sát kỹ lưỡng</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dùng chuột xoay cổ vật 360 độ, phóng to các hoa văn trên mặt trống đồng, các bức phù điêu trên đền tháp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                B2
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Đặt câu hỏi vì sao</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tại sao cư dân cổ lại tạc hình chim Lạc bay ngược chiều kim đồng hồ? Tại sao lăng Taj Mahal đối xứng tuyệt đối?
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                B3
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Kết nối lịch sử</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Liên hệ hiện vật với hoàn cảnh đời sống, kỹ nghệ luyện kim và các dấu mốc dựng nước trong sách giáo khoa.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LUYỆN TẬP TRẮC NGHIỆM */}
      {tab === 'luyen-tap-trac-nghiem' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                Thử thách kiến thức (Câu {activeQuiz + 1} / {quizzes.length})
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Luyện Tập & Củng Cố Kiến Thức Lịch Sử 10
              </h3>
            </div>
            <span className="text-xs font-bold bg-navy-soft text-navy px-3 py-1.5 rounded-full">
              Điểm số: {score}
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-base text-slate-800">
              {quizzes[activeQuiz].question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizzes[activeQuiz].options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === quizzes[activeQuiz].correct;
                let btnClass = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80';

                if (selectedAnswer !== null) {
                  if (isCorrect) btnClass = 'bg-emerald-500 text-white font-bold border-emerald-500 shadow-sm';
                  else if (isSelected) btnClass = 'bg-rose-500 text-white font-bold border-rose-500 shadow-sm';
                  else btnClass = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`p-4 rounded-2xl text-xs sm:text-sm text-left border transition font-medium ${btnClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1 animate-fade-in">
                <strong className="block font-bold">💡 Giải thích kiến thức:</strong>
                <p className="leading-relaxed">{quizzes[activeQuiz].explanation}</p>
              </div>
            )}

            {selectedAnswer !== null && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition shadow"
                >
                  {activeQuiz < quizzes.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả bài làm'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
