import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, BookOpen, Box, Award, MessageSquare, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight, Flame, Layers, Eye
} from 'lucide-react';

export default function CoreFeaturesShowcase({ topics = [], artifacts3d = [] }) {
  const navigate = useNavigate();

  // Active feature tab (for responsive mobile tab view or desktop highlight)
  const [activeFeature, setActiveFeature] = useState('topics');

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
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-300/80 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Hệ Sinh Thái Toàn Diện</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Các Chức Năng Chính Của Trang Web
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Tích hợp đầy đủ từ kho dữ liệu số hóa, mô hình bảo vật 3D 360°, hệ thống kiểm tra đánh giá năng lực đến không gian học tập chung tương tác.
          </p>
        </div>

        {/* Feature quick switcher pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveFeature('topics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeFeature === 'topics' ? 'bg-white text-navy shadow-xs font-black' : 'text-slate-600 hover:text-navy'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Kho Tư Liệu & Chủ Đề</span>
          </button>
          <button
            onClick={() => setActiveFeature('studio3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeFeature === 'studio3d' ? 'bg-white text-navy shadow-xs font-black' : 'text-slate-600 hover:text-navy'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-amber-600" />
            <span>Studio 3D</span>
          </button>
          <button
            onClick={() => setActiveFeature('quizzes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeFeature === 'quizzes' ? 'bg-white text-navy shadow-xs font-black' : 'text-slate-600 hover:text-navy'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Kiểm Tra - Đánh Giá</span>
          </button>
          <button
            onClick={() => setActiveFeature('community')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeFeature === 'community' ? 'bg-white text-navy shadow-xs font-black' : 'text-slate-600 hover:text-navy'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Không Gian Chung</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Showcase Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* ================= FEATURE 1: HỆ THỐNG KHO TƯ LIỆU & CHỦ ĐỀ HỌC TẬP ================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden relative group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-navy/10 text-navy flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4 text-navy" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                    Hệ Thống Kho Tư Liệu & Chủ Đề
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Chuẩn hóa 7 chủ đề SGK GDPT 2018</span>
                </div>
              </div>
              <Link
                to="/chu-de"
                className="text-xs font-bold text-navy hover:text-amber-600 flex items-center gap-1 transition"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Nguồn tư liệu khảo cổ học, bản đồ di tích, hình ảnh tư liệu gốc độ phân giải cao và video bài giảng được phân chia mạch lạc theo từng bài học.
            </p>

            {/* Continuous Horizontal Scrolling Ticker of Topics */}
            <div className="relative overflow-hidden py-1">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                {sampleTopics.map((topic, idx) => (
                  <Link
                    key={topic.id || idx}
                    to={`/kho-tu-lieu?topic=${topic.id}`}
                    className="w-48 sm:w-52 shrink-0 snap-start bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 overflow-hidden transition group/card flex flex-col"
                  >
                    <div className="relative h-28 bg-slate-200 overflow-hidden">
                      <img
                        src={topic.img}
                        alt={topic.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-md bg-white/90 text-navy shadow-xs">
                        Chủ đề #{idx + 1}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-xs text-slate-900 group-hover/card:text-amber-700 transition line-clamp-1">
                        {topic.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {topic.description}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>✨ Tự động tích hợp tài liệu 5512 & câu hỏi thảo luận</span>
            <Link to="/kho-tu-lieu" className="font-bold text-navy hover:underline">
              Tra cứu tư liệu →
            </Link>
          </div>
        </div>

        {/* ================= FEATURE 2: STUDIO HIỆN VẬT 3D TƯƠNG TÁC ================= */}
        <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between overflow-hidden relative group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold border border-gold/30">
                  <Box className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                    Studio Bảo Vật 3D Tương Tác
                  </h3>
                  <span className="text-[11px] text-amber-300/80 font-medium">Xoay 360° • Bóc tách hoa văn • Khảo cổ</span>
                </div>
              </div>
              <Link
                to="/studio-3d"
                className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 transition"
              >
                <span>Vào Studio 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Mô hình hóa bảo vật quốc gia với công nghệ WebGL tiên tiến. Học sinh và giáo viên có thể phóng to, xoay đa chiều và giải mã từng đường nét văn hóa.
            </p>

            {/* Continuous Scrolling Ticker of 3D Artifacts */}
            <div className="relative overflow-hidden py-1">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                {sampleArtifacts.map((art, idx) => (
                  <Link
                    key={art.code || idx}
                    to={`/studio-3d/co-vat/${art.code}`}
                    className="w-48 sm:w-52 shrink-0 snap-start bg-slate-900 hover:bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden transition group/card flex flex-col"
                  >
                    <div className="relative h-28 bg-slate-950 overflow-hidden">
                      <img
                        src={art.img}
                        alt={art.name}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-gold text-[10px] font-black border border-gold/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>3D 360°</span>
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-xs text-amber-200 group-hover/card:text-gold transition line-clamp-1">
                        {art.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                        {art.desc || art.period}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>🔍 Tương tác mượt mà trên cả máy tính & điện thoại</span>
            <Link to="/studio-3d" className="font-bold text-amber-300 hover:text-white">
              Khám phá Studio →
            </Link>
          </div>
        </div>

        {/* ================= FEATURE 3: KIỂM TRA - ĐÁNH GIÁ NĂNG LỰC ================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                    Kiểm Tra & Đánh Giá Năng Lực
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Giao bài tập • Trắc nghiệm • Chấm tự động</span>
                </div>
              </div>
              <Link
                to="/hoc-sinh/luyen-tap-trac-nghiem"
                className="text-xs font-bold text-navy hover:text-amber-600 flex items-center gap-1 transition"
              >
                <span>Làm bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Hệ thống câu hỏi trắc nghiệm khách quan đa mức độ (Nhận biết, Thông hiểu, Vận dụng) bám sát yêu cầu cần đạt của Chương trình GDPT 2018 Lịch sử 10.
            </p>

            {/* Interactive Feature Visual Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-navy">
                  <Award className="w-4 h-4 text-amber-600" />
                  Đề ôn tập: Văn minh Đông Nam Á (15 câu)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  Thời gian: 15 phút
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Câu hỏi mẫu:</strong>
                "Thành tựu tiêu biểu nhất của cư dân Đông Nam Á trong nông nghiệp cổ - trung đại là gì?"
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                  <span className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">A. Trồng trọt lúa nước</span>
                  <span className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold">B. Trồng lúa nước & gia vị ✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-3">
            <span>📊 Chấm điểm tức thì kèm giải thích chi tiết</span>
            <Link to="/hoc-sinh/luyen-tap-trac-nghiem" className="font-bold text-navy hover:underline">
              Bắt đầu luyện tập →
            </Link>
          </div>
        </div>

        {/* ================= FEATURE 4: KHÔNG GIAN HỌC TẬP CHUNG & STREAK ================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                    Không Gian Học Tập Chung & Streak
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Thảo luận nhóm • Bảng vàng chuỗi học tập</span>
                </div>
              </div>
              <Link
                to="/khong-gian-chung"
                className="text-xs font-bold text-navy hover:text-amber-600 flex items-center gap-1 transition"
              >
                <span>Tham gia phòng</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Không gian mở để học sinh và thầy cô giao lưu, đặt câu hỏi thắc mắc, cùng giải đáp kiến thức lịch sử và thi đua duy trì chuỗi Streak học bài mỗi ngày.
            </p>

            {/* Streak & Discussion Visual Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-amber-100/50 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  Top Bảng Vàng Chăm Chỉ
                </span>
                <span className="text-[10px] text-amber-700 font-bold bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                  Cập nhật hôm nay
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/90 border border-amber-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">1</span>
                    <span className="font-bold text-slate-800">Lê Thu Trang (10A1)</span>
                  </div>
                  <span className="font-extrabold text-orange-600 text-xs">🔥 14 ngày</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/90 border border-amber-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-800 font-black text-[10px] flex items-center justify-center">2</span>
                    <span className="font-bold text-slate-800">Nguyễn Quốc Huy (10A3)</span>
                  </div>
                  <span className="font-extrabold text-orange-600 text-xs">🔥 12 ngày</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-3">
            <span>💬 Đăng bài thảo luận & hỏi đáp cùng giáo viên</span>
            <Link to="/khong-gian-chung" className="font-bold text-navy hover:underline">
              Vào không gian chung →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

