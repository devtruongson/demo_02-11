import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Compass, BookOpen, Box, Users, Mail, ArrowUpRight, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#12100e] text-[#e6ded5] border-t border-[#2e261f] pt-12 pb-8 mt-16 relative overflow-hidden">
      {/* Subtle cultural motif ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#2e261f]/80">
          {/* Brand & Cultural Quote */}
          <div className="md:col-span-6 lg:col-span-6 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-amber-200 tracking-tight block">
                  Sử Ký Số
                </span>
                <span className="text-[11px] text-amber-100/60 font-medium">
                  Học liệu số & Studio 3D Lịch Sử 10 — Chuẩn GDPT 2018
                </span>
              </div>
            </Link>

            {/* Cultural Quote - As requested in feedback */}
            <div className="p-4 rounded-2xl bg-[#1b1714] border border-[#3d332a] relative">
              <span className="text-3xl text-amber-500/40 font-serif leading-none absolute -top-1 left-3">“</span>
              <p className="text-xs sm:text-sm text-amber-100/90 italic font-serif leading-relaxed pl-5 pr-2 pt-1">
                Văn hóa là cốt lõi bản sắc của một dân tộc. Văn hóa còn thì dân tộc còn, văn hóa mất thì dân tộc mất.
              </p>
              <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider text-right mt-2 pr-2">
                — Trích Cố TBT Nguyễn Phú Trọng
              </p>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Dự án số hóa học liệu lịch sử tích hợp công nghệ tương tác 3D 360°, hệ thống bài tập trắc nghiệm năng lực và không gian học tập chung phục vụ đổi mới căn bản, toàn diện giáo dục lịch sử phổ thông.
            </p>
          </div>

          {/* Nav Links Column 1: KHÁM PHÁ */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400/90 font-mono">
              KHÁM PHÁ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/chu-de" className="text-stone-300 hover:text-amber-300 transition flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>7 Chủ đề Lịch Sử 10</span>
                </Link>
              </li>
              <li>
                <Link to="/kho-tu-lieu" className="text-stone-300 hover:text-amber-300 transition flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kho tư liệu & hiện vật</span>
                </Link>
              </li>
              <li>
                <Link to="/studio-3d" className="text-stone-300 hover:text-amber-300 transition flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-amber-500" />
                  <span>Studio Bảo vật 3D 360°</span>
                </Link>
              </li>
              <li>
                <Link to="/khong-gian-chung" className="text-stone-300 hover:text-amber-300 transition flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>Không gian học tập chung</span>
                </Link>
              </li>
              <li>
                <Link to="/gioi-thieu" className="text-stone-300 hover:text-amber-300 transition flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Giới thiệu dự án GDPT 2018</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Links Column 2: KẾT NỐI & LIÊN HỆ */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400/90 font-mono">
              KẾT NỐI
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-amber-300 transition flex items-center justify-between group"
                >
                  <span>Facebook</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://threads.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-amber-300 transition flex items-center justify-between group"
                >
                  <span>Threads</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-amber-300 transition flex items-center justify-between group"
                >
                  <span>Kênh YouTube Lịch Sử</span>
                  <ArrowUpRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 transition" />
                </a>
              </li>
              <li>
                <Link
                  to="/lien-he"
                  className="text-stone-300 hover:text-amber-300 transition flex items-center justify-between group"
                >
                  <span>Hộp thư liên hệ & góp ý</span>
                  <Mail className="w-3 h-3 text-stone-500 group-hover:text-amber-400 transition" />
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-stone-500 block">Địa chỉ tiếp nhận:</span>
              <span className="text-xs text-amber-200/90 font-medium">Hà Nội — Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-200/80">© 2026 Sử Ký Số</span>
            <span>•</span>
            <span className="font-semibold text-stone-400 tracking-wider">DI SẢN SỐ HÓA — KẾT NỐI HÔM NAY</span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
            <span>Đồng hành cùng Chương trình GDPT 2018</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>Môn Lịch Sử 10</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

