import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function WhyChooseUsSection({ onOpenLogin, currentUser }) {
  const points = [
    {
      num: '01',
      title: 'Phân quyền theo vai trò rõ ràng',
      desc: 'Tách biệt không gian làm việc giữa Giáo viên (quản lý lớp, giao đề thi, chấm điểm) và Học sinh (làm bài tập, nhận nhiệm vụ, tính chuỗi Streak).'
    },
    {
      num: '02',
      title: 'Học liệu số hóa chuẩn mực & 3D 360°',
      desc: 'Dữ liệu khảo cổ, bản đồ lịch sử và bảo vật quốc gia được số hóa 3D 360° tương tác chuẩn Chương trình GDPT 2018.'
    },
    {
      num: '03',
      title: 'Không gian cộng tác & Thi đua chăm chỉ',
      desc: 'Môi trường học tập cởi mở, diễn đàn hỏi đáp trực tiếp và thi đua bảng vàng Streak tạo động lực học tập mỗi ngày.'
    }
  ];

  return (
    <section className="bg-gradient-to-r from-[#fef8ee] via-[#fdf5e8] to-[#faedd9] rounded-3xl border border-[#ecd7ba] p-6 sm:p-10 shadow-xs relative overflow-hidden">
      {/* Background clouds */}
      <div className="absolute -bottom-8 -left-8 w-60 opacity-20 pointer-events-none">
        <img src="/home-assets/cloud_1.png" alt="Mây cổ" className="w-full h-auto" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column (Matching Slide 2) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#850b10] text-[#fff8ee] text-xs font-bold uppercase tracking-wider shadow-xs">
            Tại sao chọn Sử Học Số?
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#850b10] font-serif-royal leading-tight uppercase tracking-tight">
            ĐƯỢC XÂY DỰNG CHO CÔNG VIỆC THẬT CỦA GIÁO VIÊN & HỌC SINH
          </h2>

          <div className="w-16 h-1 bg-[#850b10] rounded-full" />

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            Không chỉ là kho lưu trữ số, <strong>Sử Học Số</strong> mang đến hệ sinh thái học tập đa phương tiện tương tác, giúp việc dạy và học Lịch sử 10 trở nên trực quan, sinh động và tràn đầy cảm hứng.
          </p>

          {!currentUser && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-6 py-2.5 rounded-xl bg-[#850b10] hover:bg-[#68070b] text-white text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Trải nghiệm ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: 3 Items with Red Traditional Badges (Matching Slide 2) */}
        <div className="lg:col-span-7 space-y-4">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#ecd7ba]/80 hover:bg-white hover:border-[#dfc3a1] transition-all shadow-2xs group"
            >
              {/* Red Badge with Number */}
              <div className="w-11 h-14 rounded-xl bg-gradient-to-b from-[#940a0e] to-[#73070b] text-[#fef08a] font-serif-cinzel font-black text-base flex items-center justify-center shrink-0 shadow-md border border-amber-300/40 relative">
                <span className="drop-shadow-xs">{p.num}</span>
              </div>

              {/* Text content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#850b10] transition leading-snug">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
