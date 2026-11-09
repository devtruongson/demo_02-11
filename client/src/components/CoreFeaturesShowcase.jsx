import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, Box, Award, MessageSquare, ArrowRight,
  Sparkles, Flame
} from 'lucide-react';

export default function CoreFeaturesShowcase({
  topics = [],
  artifacts3d = [],
  currentUser = null,
  onOpenLogin
}) {
  const navigate = useNavigate();

  const handleActionClick = (e, targetPath) => {
    if (!currentUser) {
      e.preventDefault();
      onOpenLogin?.();
      return;
    }
  };

  // Fallback topics if none passed
  const sampleTopics = topics.length > 0 ? topics : [
    { id: 1, title: 'Thế giới cổ đại', img: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80', description: 'Những nền văn minh đầu tiên và di sản rực rỡ của thế giới cổ đại.' },
    { id: 2, title: 'Thế giới trung đại', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', description: 'Các xã hội phong kiến, nhà nước và thành tựu văn hóa tiêu biểu.' },
    { id: 3, title: 'Một số nền văn minh châu Á', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80', description: 'Ấn Độ, Trung Hoa, Đông Nam Á và những cái nôi rực rỡ.' },
    { id: 4, title: 'Văn minh Đông Nam Á', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80', description: 'Di sản, giao lưu hàng hải và thành tựu rực rỡ thời cổ - trung đại.' },
    { id: 5, title: 'Các cuộc cách mạng công nghiệp', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', description: 'Bước nhảy vọt về khoa học, công nghệ, kinh tế và biến đổi xã hội.' },
    { id: 6, title: 'Thế giới hiện đại', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', description: 'Các tiến trình biến đổi, toàn cầu hóa và các vấn đề thời đại.' },
    { id: 7, title: 'Việt Nam trong lịch sử thế giới', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', description: 'Vị thế và đóng góp của Việt Nam trong dòng chảy văn minh nhân loại.' }
  ];

  // Fallback 3D artifacts if none passed
  const sampleArtifacts = artifacts3d.length > 0 ? artifacts3d : [
    { code: 'dong_son_drum', name: 'Trống đồng Ngọc Lũ', period: 'Văn hóa Đông Sơn (TK VII TCN)', culture: 'Đông Sơn', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80', desc: 'Bảo vật quốc gia biểu tượng cho đỉnh cao luyện kim đồ đồng thời Hùng Vương.' },
    { code: 'vo_canh_stele', name: 'Bia Võ Cạnh', period: 'Thế kỷ II - III', culture: 'Chăm-pa cổ', img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80', desc: 'Tấm văn bia chữ Phạn cổ nhất tại Đông Nam Á, minh chứng giao lưu văn hóa Ấn Độ.' },
    { code: 'banh_it_tower', name: 'Tháp Bánh Ít (Bình Định)', period: 'Thế kỷ XI - XII', culture: 'Chăm-pa', img: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80', desc: 'Quần thể kiến trúc đền tháp Chăm độc đáo với nghệ thuật điêu khắc phù điêu tinh xảo.' },
    { code: 'borobudur', name: 'Quần thể đền tháp Borobudur', period: 'Thế kỷ VIII - IX', culture: 'Đông Nam Á', img: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80', desc: 'Kỳ quan kiến trúc Phật giáo lớn nhất thế giới được UNESCO công nhận là di sản nhân loại.' }
  ];

  return (
    <section id="chuc-nang-chinh" className="space-y-6">
      {/* Section Header (Matching Slide 2 & User Image) */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#850b10] text-[#fff8ee] shadow-sm uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#fef08a]" />
          <span>Hệ sinh thái toàn diện</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#850b10] font-serif-royal tracking-tight uppercase">
          CÁC CHỨC NĂNG CHÍNH CỦA TRANG WEB
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm font-semibold text-[#850b10]/90">
          <span>• Kho tư liệu</span>
          <span>• Không gian 3D</span>
          <span>• Kiểm tra - Đánh giá</span>
          <span>• Không gian học tập</span>
        </div>
      </div>

      {/* 4 Feature Showcase Cards Grid in 2x2 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 pt-2">
        {/* ================= FEATURE 1: HỆ THỐNG KHO TƯ LIỆU ================= */}
        <div className="bg-[#fff5e4] rounded-3xl border border-[#ecd9ba] p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden relative group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#850b10] text-[#fff8ee] flex items-center justify-center font-bold shadow-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-[#850b10] uppercase tracking-wide leading-tight">
                    HỆ THỐNG KHO TƯ LIỆU
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Chuẩn hóa 7 chủ đề SGK GDPT 2018</span>
                </div>
              </div>
              <Link
                to="/chu-de"
                onClick={handleActionClick}
                className="text-xs font-bold text-[#850b10] hover:text-[#590408] flex items-center gap-1 transition"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              Kho học liệu số đa dạng (hình ảnh, video, infographic) đã được kiểm chứng, chuẩn hóa thông tin. Tích hợp sẵn gợi ý giải pháp sư phạm, kế hoạch bài dạy 5512 và hệ thống câu hỏi thảo luận theo từng chủ đề.
            </p>

            {/* Topics scroll preview */}
            <div className="relative overflow-hidden py-1">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                {sampleTopics.map((topic, idx) => (
                  <Link
                    key={topic.id || idx}
                    to={`/kho-tu-lieu?topic=${topic.id}`}
                    onClick={handleActionClick}
                    className="w-44 sm:w-48 shrink-0 snap-start bg-white/80 hover:bg-white rounded-2xl border border-[#ecd9ba] overflow-hidden transition group/card flex flex-col shadow-2xs"
                  >
                    <div className="relative h-24 bg-slate-200 overflow-hidden">
                      <img
                        src={topic.img}
                        alt={topic.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#590408]/70 via-transparent to-transparent" />
                      <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-md bg-[#850b10] text-[#fff8ee] shadow-xs">
                        Chủ đề {idx + 1}
                      </span>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-xs text-slate-900 group-hover/card:text-[#850b10] transition line-clamp-1">
                        {topic.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                        {topic.description}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#ecd9ba]/70 flex items-center justify-between text-xs text-slate-600 mt-2">
            <span>✨ Tự động tích hợp tài liệu 5512 & câu hỏi thảo luận</span>
            <Link to="/kho-tu-lieu" onClick={handleActionClick} className="font-bold text-[#850b10] hover:underline">
              Tra cứu tư liệu →
            </Link>
          </div>
        </div>

        {/* ================= FEATURE 2: KHÔNG GIAN 3D ================= */}
        <div className="bg-gradient-to-b from-[#2a0406] to-[#1c0204] text-white rounded-3xl border border-amber-500/30 p-5 sm:p-6 shadow-xl flex flex-col justify-between overflow-hidden relative group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#850b10] text-[#fef08a] border border-amber-300/40 flex items-center justify-center font-bold shadow-xs">
                  <Box className="w-4 h-4 text-[#fef08a]" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-[#fef08a] uppercase tracking-wide leading-tight">
                    Không gian 3D
                  </h3>
                  <span className="text-[11px] text-amber-300/80 font-medium">Xoay 360° • Bóc tách hoa văn • Khảo cổ</span>
                </div>
              </div>
              <Link
                to="/studio-3d"
                onClick={handleActionClick}
                className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 transition"
              >
                <span>Vào Không gian 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-amber-100/80 leading-relaxed mb-4">
              Khám phá hiện vật lịch sử bằng mô hình 3D 360 độ sắc nét. Học sinh và giáo viên có thể phóng to, xoay chuyển đa chiều và đọc thông tin chi tiết, khắc phục hoàn toàn hạn chế của việc không thể tiếp cận bảo tàng thực tế.
            </p>

            {/* Continuous Scrolling Ticker of 3D Artifacts */}
            <div className="relative overflow-hidden py-1">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                {sampleArtifacts.map((art, idx) => (
                  <Link
                    key={art.code || idx}
                    to={`/studio-3d/co-vat/${art.code}`}
                    onClick={handleActionClick}
                    className="w-44 sm:w-48 shrink-0 snap-start bg-[#38060a] hover:bg-[#46080d] rounded-2xl border border-amber-500/30 overflow-hidden transition group/card flex flex-col"
                  >
                    <div className="relative h-24 bg-stone-100 overflow-hidden flex items-center justify-center">
                      {art.img ? (
                        <>
                          <img
                            src={art.img}
                            alt={art.name}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.card-fallback-box');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        </>
                      ) : null}

                      {/* Fallback Graphic like Studio 3D */}
                      <div
                        className={`card-fallback-box w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center text-[#850B10] p-2 ${
                          art.img ? 'hidden' : 'flex'
                        }`}
                      >
                        <Box className="w-7 h-7 text-[#850B10]/70 group-hover/card:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold text-[#850B10]/80 mt-1 uppercase tracking-wider">
                          Mô hình 3D
                        </span>
                      </div>

                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#850b10] text-[#fef08a] text-[10px] font-black border border-amber-300/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>3D 360°</span>
                      </div>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-xs text-amber-200 group-hover/card:text-[#fef08a] transition line-clamp-1">
                        {art.name}
                      </h4>
                      <span className="text-[10px] text-amber-200/70 line-clamp-1 mt-0.5 leading-snug">
                        {art.desc || art.period}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-200/80 mt-2">
            <span>🔍 Tương tác mượt mà trên cả máy tính & điện thoại</span>
            <Link to="/studio-3d" onClick={handleActionClick} className="font-bold text-amber-300 hover:text-white">
              Khám phá Không gian 3D →
            </Link>
          </div>
        </div>

        {/* ================= FEATURE 3: KIỂM TRA - ĐÁNH GIÁ ================= */}
        <div className="bg-[#fff5e4] rounded-3xl border border-[#ecd9ba] p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#850b10] text-[#fff8ee] flex items-center justify-center font-bold shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-[#850b10] uppercase tracking-wide leading-tight">
                    KIỂM TRA - ĐÁNH GIÁ
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Giao bài tập • Trắc nghiệm • Chấm tự động</span>
                </div>
              </div>
              <Link
                to="/hoc-sinh/luyen-tap-trac-nghiem"
                onClick={handleActionClick}
                className="text-xs font-bold text-[#850b10] hover:text-[#590408] flex items-center gap-1 transition"
              >
                <span>Làm bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              Hệ thống câu hỏi trắc nghiệm khách quan đa mức độ (Nhận biết, Thông hiểu, Vận dụng) bám sát yêu cầu cần đạt của Chương trình GDPT 2018 Lịch sử 10.
            </p>

            {/* Interactive Preview */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#ecd9ba] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-[#850b10]">
                  <Award className="w-4 h-4 text-[#850b10]" />
                  Đề ôn tập: Văn minh Đông Nam Á (15 câu)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  15 phút
                </span>
              </div>

              <div className="p-2.5 bg-[#fef8ee] rounded-xl border border-[#ecd9ba]/80 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Câu hỏi mẫu:</strong>
                "Thành tựu tiêu biểu nhất của cư dân Đông Nam Á trong nông nghiệp cổ - trung đại là gì?"
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                  <span className="p-1.5 rounded-lg bg-white border border-[#ecd9ba] text-slate-600">A. Trồng trọt lúa nước</span>
                  <span className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold">B. Trồng lúa nước & gia vị ✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#ecd9ba]/70 flex items-center justify-between text-xs text-slate-600 mt-3">
            <span>📊 Chấm điểm tức thì kèm giải thích chi tiết</span>
            <Link to="/hoc-sinh/luyen-tap-trac-nghiem" onClick={handleActionClick} className="font-bold text-[#850b10] hover:underline">
              Bắt đầu luyện tập →
            </Link>
          </div>
        </div>

        {/* ================= FEATURE 4: KHÔNG GIAN HỌC TẬP ================= */}
        <div className="bg-[#fff5e4] rounded-3xl border border-[#ecd9ba] p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#850b10] text-[#fff8ee] flex items-center justify-center font-bold shadow-xs">
                  <Flame className="w-4 h-4 text-[#fef08a]" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-[#850b10] uppercase tracking-wide leading-tight">
                    KHÔNG GIAN HỌC TẬP
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Thảo luận nhóm • Bảng vàng chuỗi học tập (Streak)</span>
                </div>
              </div>
              <Link
                to="/khong-gian-chung"
                onClick={handleActionClick}
                className="text-xs font-bold text-[#850b10] hover:text-[#590408] flex items-center gap-1 transition"
              >
                <span>Tham gia phòng</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              Không gian mở để học sinh và thầy cô giao lưu, đặt câu hỏi thắc mắc, cùng giải đáp kiến thức lịch sử và thi đua duy trì chuỗi Streak học bài mỗi ngày.
            </p>

            {/* Streak & Discussion Preview */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#ecd9ba] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#850b10] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  Top Bảng Vàng Chăm Chỉ
                </span>
                <span className="text-[10px] text-[#850b10] font-bold bg-[#fef8ee] px-2 py-0.5 rounded-md border border-[#ecd9ba]">
                  Cập nhật hôm nay
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#fef8ee] border border-[#ecd9ba]/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#850b10] text-[#fef08a] font-black text-[10px] flex items-center justify-center">1</span>
                    <span className="font-bold text-slate-800">Lê Thu Trang (10A1)</span>
                  </div>
                  <span className="font-extrabold text-orange-600 text-xs">🔥 14 ngày</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#fef8ee] border border-[#ecd9ba]/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-800 font-black text-[10px] flex items-center justify-center">2</span>
                    <span className="font-bold text-slate-800">Nguyễn Quốc Huy (10A3)</span>
                  </div>
                  <span className="font-extrabold text-orange-600 text-xs">🔥 12 ngày</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#ecd9ba]/70 flex items-center justify-between text-xs text-slate-600 mt-3">
            <span>💬 Đăng bài thảo luận & hỏi đáp cùng giáo viên</span>
            <Link to="/khong-gian-chung" onClick={handleActionClick} className="font-bold text-[#850b10] hover:underline">
              Vào không gian chung →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
