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
    <footer className="relative bg-gradient-to-b from-[#850b10] via-[#73070b] to-[#590408] text-[#fff8ee] border-t-2 border-amber-500/30 pt-10 sm:pt-14 pb-8 overflow-hidden select-none">
      {/* Background Dong Son patterns watermark */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url('/home-assets/Dong_Son_patterns.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '-120px center',
          backgroundSize: '550px auto'
        }}
      />

      {/* Floating clouds decorative accents */}
      <div className="absolute top-2 right-4 w-48 opacity-25 pointer-events-none">
        <img src="/home-assets/cloud_2.png" alt="Mây cổ" className="w-full h-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================= LEFT COLUMN: BRAND & DESCRIPTION ================= */}
          <div className="lg:col-span-7 space-y-5">
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-3.5">
              <img
                src="/home-assets/logo.png"
                alt="Logo Sử Học Số"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md"
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-cinzel tracking-wider uppercase leading-none">
                  SỬ HỌC SỐ
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-[#fef08a] uppercase tracking-wide mt-1">
                  Đưa lịch sử đến gần hơn bằng công nghệ số
                </p>
              </div>
            </div>

            {/* Description Card with border (Matching Slide 5) */}
            <div className="p-4 sm:p-5 rounded-3xl bg-black/25 backdrop-blur-xs border border-white/20 shadow-inner max-w-xl">
              <p className="text-xs sm:text-sm text-[#fff8ee]/95 leading-relaxed font-light">
                Dự án số hóa học liệu lịch sử tích hợp công nghệ tương tác 3D 360°, hệ thống bài tập trắc nghiệm năng lực và không gian học tập chung phục vụ đổi mới căn bản, toàn diện giáo dục lịch sử phổ thông.
              </p>
            </div>

            {/* Additional Project Statement (Matching Slide 5) */}
            <p className="text-xs sm:text-sm text-[#fde68a]/90 leading-relaxed max-w-xl font-normal">
              Dự án số hóa học liệu lịch sử tích hợp công nghệ tương tác 3D 360°, hệ thống bài tập trắc nghiệm năng lực và không gian học tập chung phục vụ đổi mới căn bản, toàn diện giáo dục lịch sử phổ thông.
            </p>
          </div>

          {/* ================= RIGHT COLUMN: INSTRUCTOR & STUDENTS ================= */}
          <div className="lg:col-span-5 space-y-6 sm:pl-4">
            {/* Giảng Viên Hướng Dẫn */}
            <div className="space-y-2">
              <div className="inline-block px-5 py-1.5 rounded-full border border-white/50 bg-[#850b10]/80 shadow-md">
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  GIẢNG VIÊN HƯỚNG DẪN
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white tracking-wide pl-2">
                Th.S Lê Thị Hiếu Ngân
              </p>
            </div>

            {/* Nhóm Sinh Viên Thực Hiện */}
            <div className="space-y-2">
              <div className="inline-block px-5 py-1.5 rounded-full border border-white/50 bg-[#850b10]/80 shadow-md">
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  NHÓM SV THỰC HIỆN
                </span>
              </div>

              <div className="space-y-1.5 pl-2 text-xs sm:text-sm text-[#fff8ee]/95 font-medium">
                {students.map((student, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fef08a]" />
                    <span>{student}</span>
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
