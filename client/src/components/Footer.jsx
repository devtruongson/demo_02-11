import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const students = [
    'Trần Thị Như Quỳnh',
    'Phan Thị Bảo Nhi',
    'Trần Thiên Khánh',
    'Lê Thị Thanh Hoa',
    'Nguyễn Minh Huy',
    'Trần Mai Anh',
    'Ngô Anh Thư'
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#850b10] via-[#75070c] to-[#590408] text-[#fff8ee] border-t-2 border-amber-500/30 pt-12 sm:pt-16 pb-10 overflow-hidden select-none">
      {/* Background Dong Son patterns watermark on left side matching mockup */}
      <div
        className="absolute top-0 bottom-0 left-0 w-full sm:w-[70%] lg:w-[55%] pointer-events-none mix-blend-multiply opacity-85"
        style={{
          backgroundImage: `url('/home-assets/Dong_Son_patterns.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          backgroundSize: 'cover'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ================= LEFT COLUMN: BRAND & DESCRIPTION ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-4">
              <img
                src="/home-assets/logo.png"
                alt="Logo Sử Học Số"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md shrink-0"
              />
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FCE8AA] font-sans tracking-wide uppercase leading-none">
                  SỬ HỌC SỐ
                </h2>
                <p className="text-xs sm:text-sm md:text-base font-medium text-white/95 mt-1.5 leading-snug">
                  Đưa lịch sử đến gần hơn bằng công nghệ số
                </p>
              </div>
            </div>

            {/* Description Card with border (Matching mockup) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#6B060B]/85 border border-white/35 shadow-2xl max-w-xl">
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal">
                Dự án “Sử học số” xây dựng nền tảng học liệu số với không gian 3D, hệ thống hóa bài tập kiểm tra - đánh giá, đa dạng hóa hình thức dạy học thông qua tích hợp kế hoạch giảng dạy theo Chương trình GDPT 2018. Từ đó, dự án nhằm hỗ trợ cộng đồng giáo viên, sinh viên sư phạm đổi mới phương pháp dạy học đồng thời phát huy tính chủ động, sáng tạo của học sinh; đưa lịch sử đến gần với bước tiến công nghệ số.
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INSTRUCTOR & STUDENTS ================= */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            {/* Giảng Viên Hướng Dẫn */}
            <div className="space-y-2">
              <div className="inline-flex items-center px-6 py-2 rounded-full border border-white/60 bg-[#7B080D] shadow-md">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#FCE8AA]">
                  GIẢNG VIÊN HƯỚNG DẪN
                </span>
              </div>
              <p className="text-base sm:text-lg font-medium text-white tracking-wide pl-3">
                Th.S Lê Thị Hiếu Ngân
              </p>
            </div>

            {/* Nhóm Sinh Viên Thực Hiện */}
            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center px-6 py-2 rounded-full border border-white/60 bg-[#7B080D] shadow-md">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#FCE8AA]">
                  NHÓM SV THỰC HIỆN
                </span>
              </div>

              <div className="space-y-1.5 pl-3 text-sm sm:text-base text-white/95 font-medium">
                {students.map((student, idx) => (
                  <div key={idx} className="leading-snug">
                    {student}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#fed7aa]/80 gap-2">
          <span>© 2026 SỬ HỌC SỐ — Dự án phát triển học liệu số Lịch sử 10 GDPT 2018</span>
          <div className="flex items-center gap-4">
            <Link to="/gioi-thieu" className="hover:text-white transition">Giới thiệu</Link>
            <Link to="/lien-he" className="hover:text-white transition">Liên hệ & Góp ý</Link>
            <Link to="/chu-de" className="hover:text-white transition">Chủ đề học tập</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
