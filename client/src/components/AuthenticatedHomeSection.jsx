import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, Box, Flame, GraduationCap, ArrowRight,
  Sparkles, Users, Award, BookOpen, Clock, CheckCircle2,
  FileText, PlusCircle
} from 'lucide-react';

export default function AuthenticatedHomeSection({
  currentUser,
  topics = [],
  artifacts3d = []
}) {
  const navigate = useNavigate();
  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

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
    <div className="space-y-8 sm:space-y-10">
      {/* ============================================================== */}
      {/* CARD 1: CHỦ ĐỀ HỌC TẬP (GIỮ NGUYÊN PHẦN CHỦ ĐỀ Ở TRANG CHỦ)   */}
      {/* ============================================================== */}
      <section id="chuc-nang-chinh" className="bg-[#FFF5DC] rounded-3xl border border-[#ECD9BA] p-6 sm:p-8 shadow-sm transition hover:shadow-md relative overflow-hidden">
        {/* Scalloped Badge Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#850B10] text-[#FFF7E8] font-black text-sm uppercase tracking-wider shadow-sm select-none">
              <Compass className="w-4 h-4 text-amber-300" />
              <span>CHỦ ĐỀ HỌC TẬP</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium italic mt-2">
              Thông tin mô tả: Hệ thống 7 chủ đề Lịch sử 10 chuẩn GDPT 2018 - Tích hợp nguồn học liệu số phong phú, hình ảnh khảo cổ học độ phân giải cao và bài tập tương tác.
            </p>
          </div>

          <Link
            to="/chu-de"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#850B10] hover:text-[#590408] bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-[#ECD9BA] transition shrink-0 self-start sm:self-auto shadow-2xs"
          >
            <span>Xem tất cả chủ đề</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel / Grid of 7 Topics */}
        <div className="relative overflow-hidden pt-2">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
            {sampleTopics.map((topic, idx) => (
              <Link
                key={topic.id || idx}
                to={`/kho-tu-lieu?topic=${topic.id}`}
                className="w-56 sm:w-64 shrink-0 snap-start bg-white rounded-2xl border border-[#ECD9BA] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col group/card shadow-xs"
              >
                <div className="relative h-32 sm:h-36 bg-slate-200 overflow-hidden">
                  <img
                    src={topic.img}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#590408]/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 text-[11px] font-black px-2.5 py-1 rounded-md bg-[#850B10] text-[#FFF7E8] shadow-xs">
                    Chủ đề {idx + 1}
                  </span>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover/card:text-[#850B10] transition line-clamp-1">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#850B10]">
                    <span>Khám phá bài học</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CARD 2: KHÔNG GIAN 3D (GIỮ NGUYÊN PHẦN 3D Ở TRANG CHỦ)         */}
      {/* ============================================================== */}
      <section className="bg-[#FFF5DC] rounded-3xl border border-[#ECD9BA] p-6 sm:p-8 shadow-sm transition hover:shadow-md relative overflow-hidden">
        {/* Scalloped Badge Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#850B10] text-[#FFF7E8] font-black text-sm uppercase tracking-wider shadow-sm select-none">
              <Box className="w-4 h-4 text-amber-300" />
              <span>KHÔNG GIAN 3D</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium italic mt-2">
              Thông tin mô tả: Bảo tàng số mô phỏng 3D 360° tương tác đa chiều. Trực quan hóa bảo vật quốc gia, di sản văn hóa và kiến trúc cổ kính với công nghệ WebGL hiện đại.
            </p>
          </div>

          <Link
            to="/studio-3d"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#850B10] hover:text-[#590408] bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-[#ECD9BA] transition shrink-0 self-start sm:self-auto shadow-2xs"
          >
            <span>Vào Studio 3D</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel / Grid of 3D Artifacts */}
        <div className="relative overflow-hidden pt-2">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
            {sampleArtifacts.map((art, idx) => (
              <Link
                key={art.code || idx}
                to={`/studio-3d/co-vat/${art.code}`}
                className="w-56 sm:w-64 shrink-0 snap-start bg-[#2B0407] text-white rounded-2xl border border-amber-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col group/art shadow-sm"
              >
                <div className="relative h-32 sm:h-36 bg-stone-100 overflow-hidden flex items-center justify-center">
                  {art.img ? (
                    <>
                      <img
                        src={art.img}
                        alt={art.name}
                        className="w-full h-full object-cover group-hover/art:scale-108 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.card-fallback-box');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    </>
                  ) : null}

                  {/* Fallback Graphic like Studio 3D */}
                  <div
                    className={`card-fallback-box w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center text-[#850B10] p-4 ${
                      art.img ? 'hidden' : 'flex'
                    }`}
                  >
                    <Box className="w-10 h-10 text-[#850B10]/70 group-hover/art:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-[#850B10]/80 mt-1 uppercase tracking-wider">
                      Mô hình 3D
                    </span>
                  </div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#850B10] text-amber-200 text-[10px] font-black border border-amber-300/30 shadow-xs">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>3D 360°</span>
                  </div>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-bold text-sm text-amber-200 group-hover/art:text-[#FFF7E8] transition line-clamp-1">
                      {art.name}
                    </h4>
                    <p className="text-[11px] text-amber-100/70 line-clamp-2 mt-1 leading-relaxed">
                      {art.desc || art.period}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-bold text-amber-300 group-hover/art:text-amber-200">
                    <span>Xoay & Khảo sát 3D</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/art:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CARD 3: KHÔNG GIAN HỌC TẬP                                      */}
      {/* ============================================================== */}
      <section className="bg-[#FFF5DC] rounded-3xl border border-[#ECD9BA] p-6 sm:p-8 shadow-sm transition hover:shadow-md relative overflow-hidden">
        {/* Scalloped Badge Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#850B10] text-[#FFF7E8] font-black text-sm uppercase tracking-wider shadow-sm select-none">
              <Flame className="w-4 h-4 text-amber-300" />
              <span>KHÔNG GIAN HỌC TẬP</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium italic mt-2">
              Thông tin mô tả: Môi trường cộng tác học tập trực tuyến. Tham gia diễn đàn thảo luận môn Lịch sử 10, trao đổi cùng thầy cô và thi đua duy trì chuỗi Streak học bài mỗi ngày.
            </p>
          </div>

          <Link
            to="/khong-gian-chung"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#850B10] hover:text-[#590408] bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-[#ECD9BA] transition shrink-0 self-start sm:self-auto shadow-2xs"
          >
            <span>Vào không gian học tập</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2 Interactive Columns: Streak Leaderboard & Hot Discussions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
          {/* Column A: Top Bảng Vàng Thi Đua (Streak) */}
          <div className="bg-white rounded-2xl border border-[#ECD9BA] p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <h4 className="font-black text-xs sm:text-sm text-[#850B10] uppercase tracking-wide">
                  Top Bảng Vàng Chăm Chỉ
                </h4>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Tuần này
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FEF8EE] border border-[#ECD9BA]/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#850B10] text-amber-200 font-black text-xs flex items-center justify-center shadow-xs">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 block">Lê Thu Trang</span>
                    <span className="text-[10px] text-slate-500">Lớp 10A1</span>
                  </div>
                </div>
                <span className="font-black text-orange-600 text-xs bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  🔥 14 ngày
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FEF8EE] border border-[#ECD9BA]/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 block">Nguyễn Quốc Huy</span>
                    <span className="text-[10px] text-slate-500">Lớp 10A3</span>
                  </div>
                </div>
                <span className="font-black text-orange-600 text-xs bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  🔥 12 ngày
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FEF8EE] border border-[#ECD9BA]/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-700/30 text-amber-900 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 block">Trần Thiên Khánh</span>
                    <span className="text-[10px] text-slate-500">Lớp 10A2</span>
                  </div>
                </div>
                <span className="font-black text-orange-600 text-xs bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  🔥 10 ngày
                </span>
              </div>
            </div>
          </div>

          {/* Column B: Diễn Đàn & Thảo Luận Mới Nhất */}
          <div className="bg-white rounded-2xl border border-[#ECD9BA] p-4 sm:p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#850B10]" />
                  <h4 className="font-black text-xs sm:text-sm text-[#850B10] uppercase tracking-wide">
                    Chủ Đề Thảo Luận Nổi Bật
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  3 phòng hoạt động
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  to="/khong-gian-chung"
                  className="block p-2.5 rounded-xl bg-[#FEF8EE] hover:bg-[#FDF0D5] border border-[#ECD9BA]/60 transition group/disc"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover/disc:text-[#850B10] line-clamp-1">
                    💬 Ý nghĩa biểu tượng chim Lạc trên Trống đồng Đông Sơn?
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                    <span>18 câu trả lời</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Giáo viên đã phản hồi</span>
                  </div>
                </Link>

                <Link
                  to="/khong-gian-chung"
                  className="block p-2.5 rounded-xl bg-[#FEF8EE] hover:bg-[#FDF0D5] border border-[#ECD9BA]/60 transition group/disc"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover/disc:text-[#850B10] line-clamp-1">
                    💬 So sánh kiến trúc tháp Chăm-pa và đền tháp Ăng-co Vat?
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                    <span>12 câu trả lời</span>
                    <span>•</span>
                    <span className="text-slate-600">Mới cập nhật 15 phút trước</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Cùng đóng góp ý kiến & nhận điểm chuyên cần</span>
              <Link to="/khong-gian-chung" className="font-bold text-[#850B10] hover:underline text-xs">
                Xem diễn đàn →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CARD 4: LỚP HỌC CỦA TÔI (CHỈ HIỂN THỊ KHI ROLE LÀ GIÁO VIÊN)    */}
      {/* Theo mẫu /design/image copy 3.png                              */}
      {/* ============================================================== */}
      {isTeacher && (
        <section className="bg-[#FFF5DC] rounded-3xl border border-[#ECD9BA] p-6 sm:p-8 shadow-sm transition hover:shadow-md relative overflow-hidden">
          {/* Scalloped Badge Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#850B10] text-[#FFF7E8] font-black text-sm uppercase tracking-wider shadow-sm select-none">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>LỚP HỌC CỦA TÔI</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium italic mt-2">
                Thông tin mô tả: Trung tâm điều phối lớp học và quản lý học tập dành riêng cho giáo viên. Quản lý danh sách học sinh, tạo đề kiểm tra trắc nghiệm và theo dõi kết quả tự động.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <Link
                to="/giao-vien/quan-ly-lop"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#850B10] hover:text-[#590408] bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-[#ECD9BA] transition shadow-2xs"
              >
                <span>Quản lý lớp học</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/giao-vien/giao-bai"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#850B10] hover:bg-[#68070B] px-4 py-2 rounded-xl transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Giao bài mới</span>
              </Link>
            </div>
          </div>

          {/* Teacher's Class Cards Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            <div className="bg-white rounded-2xl border border-[#ECD9BA] p-5 sm:p-6 shadow-2xs space-y-3.5 transition hover:shadow-md hover:border-amber-300">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#850B10] text-[#FFF7E8] text-xs font-black">
                  Lớp 10A1
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  42 học sinh
                </span>
              </div>
              <div>
                <h5 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">Lịch sử 10 - Năm học 2026-2027</h5>
                <p className="text-xs text-slate-500 mt-1">Tiến độ bài học: Chủ đề 4</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>📝 Đã giao: <strong className="text-slate-800">3 bài tập</strong></span>
                <Link to="/giao-vien/lop-hoc" className="font-bold text-[#850B10] hover:text-[#590408] transition text-xs flex items-center gap-0.5">
                  <span>Xem chi tiết</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECD9BA] p-5 sm:p-6 shadow-2xs space-y-3.5 transition hover:shadow-md hover:border-amber-300">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#850B10] text-[#FFF7E8] text-xs font-black">
                  Lớp 10A2
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  40 học sinh
                </span>
              </div>
              <div>
                <h5 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">Lịch sử 10 - Năm học 2026-2027</h5>
                <p className="text-xs text-slate-500 mt-1">Tiến độ bài học: Chủ đề 3</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>📝 Đã giao: <strong className="text-slate-800">2 bài tập</strong></span>
                <Link to="/giao-vien/lop-hoc" className="font-bold text-[#850B10] hover:text-[#590408] transition text-xs flex items-center gap-0.5">
                  <span>Xem chi tiết</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECD9BA] p-5 sm:p-6 shadow-2xs space-y-3.5 transition hover:shadow-md hover:border-amber-300">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#850B10] text-[#FFF7E8] text-xs font-black">
                  Lớp 10A3
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  41 học sinh
                </span>
              </div>
              <div>
                <h5 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">Lịch sử 10 - Năm học 2026-2027</h5>
                <p className="text-xs text-slate-500 mt-1">Tiến độ bài học: Chủ đề 4</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>📝 Đã giao: <strong className="text-slate-800">3 bài tập</strong></span>
                <Link to="/giao-vien/lop-hoc" className="font-bold text-[#850B10] hover:text-[#590408] transition text-xs flex items-center gap-0.5">
                  <span>Xem chi tiết</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
