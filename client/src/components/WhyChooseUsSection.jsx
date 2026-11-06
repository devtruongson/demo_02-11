import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, GraduationCap, Users, Box, BookOpen, CheckCircle,
  Sparkles, ArrowRight, Award, Flame, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function WhyChooseUsSection({ onOpenLogin, currentUser }) {
  const advantages = [
    {
      title: 'Phân quyền theo vai trò rõ ràng',
      desc: 'Tách biệt không gian làm việc giữa Giáo viên (quản lý lớp, giao đề thi, chấm điểm) và Học sinh (làm bài tập, nhận nhiệm vụ, tính chuỗi Streak).',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Đồng bộ Kế hoạch bài dạy 5512',
      desc: 'Hỗ trợ giáo viên soạn bài giảng chuẩn Công văn 5512 chỉ trong vài phút, tích hợp sẵn chuỗi hoạt động học và gợi ý tổ chức sư phạm.',
      icon: GraduationCap,
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      title: 'Hiện vật 3D 360° tương tác sống động',
      desc: 'Bóc tách hoa văn, khảo sát kích thước thực tế của bảo vật quốc gia ngay trên trình duyệt mà không cần cài đặt phần mềm phức tạp.',
      icon: Box,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      title: 'Kiểm tra trắc nghiệm & Bảng vàng thi đua',
      desc: 'Hệ thống ngân hàng câu hỏi bám sát chuẩn kiến thức kỹ năng GDPT 2018, tự động chấm điểm và vinh danh học sinh chăm chỉ.',
      icon: Award,
      color: 'bg-purple-50 text-purple-800 border-purple-200'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Advantages & Description */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-navy/10 text-navy border border-navy/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>TẠI SAO CHỌN SỬ KÝ SỐ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              Được xây dựng cho công việc thật của giáo viên & học sinh.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Không chỉ là kho lưu trữ số, Sử Ký Số mang đến hệ sinh thái học tập đa phương tiện tương tác, giúp việc dạy và học Lịch sử 10 trở nên trực quan, sinh động và tràn đầy cảm hứng.
            </p>
          </div>

          {/* List of 4 Advantages */}
          <div className="space-y-3.5">
            {advantages.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {!currentUser ? (
              <button
                onClick={onOpenLogin}
                className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition shadow-sm flex items-center gap-2 active:scale-95"
              >
                <span>Đăng ký trải nghiệm miễn phí</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to={currentUser.role === 'teacher' ? '/giao-vien' : '/hoc-sinh'}
                className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition shadow-sm flex items-center gap-2 active:scale-95"
              >
                <span>Vào không gian {currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              to="/gioi-thieu"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200"
            >
              Tìm hiểu triết lý sư phạm
            </Link>
          </div>
        </div>

        {/* Right Column: Visual UI Card Preview (Matching User Feedback Screenshot) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Mô hình phân quyền
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                  Phân Quyền Theo Vai Trò
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Hoạt động
              </span>
            </div>

            {/* Role Card Item 1: Teacher */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 truncate">Thầy Hoàng Thu Hà</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                      Giáo viên
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">THPT Chuyên • 2 lớp học phụ trách</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg shrink-0">
                Giao bài ✓
              </span>
            </div>

            {/* Role Card Item 2: Student */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 truncate">Nguyễn Minh Tuấn</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                      Học sinh
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">Lớp 10A1 • Đã nộp 5/5 bài tập</p>
                </div>
              </div>
              <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>Streak 8d</span>
              </span>
            </div>

            {/* Role Card Item 3: Admin */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-gold flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 truncate">Quản Trị Viên</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                      Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">Toàn quyền hệ thống & phân quyền</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg shrink-0">
                Kiểm duyệt
              </span>
            </div>

            {/* Card Footer Feature Highlights */}
            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Bảo mật dữ liệu học đường
              </span>
              <span className="text-slate-400 font-mono">Phiên bản 2.5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

