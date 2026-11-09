import React from 'react';

/**
 * Traditional Imperial Tally / Lacquer Tablet Tag (Thẻ bài sơn son thếp vàng)
 * Shape and design matching /design/image copy.png
 */
function TraditionalTabletTag({ num }) {
  return (
    <div className="relative w-11 sm:w-12 h-16 sm:h-18 shrink-0 flex items-center justify-center select-none filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
      <svg
        viewBox="0 0 46 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Red Lacquer Body with bracketed notches */}
        <path
          d="M4 0 H42 C44.2 0 46 1.8 46 4 V12 C46 14.2 44.2 16 42 16 H39 V64 H42 C44.2 64 46 65.8 46 68 V76 C46 78.2 44.2 80 42 80 H4 C1.8 80 0 78.2 0 76 V68 C0 65.8 1.8 64 4 64 H7 V16 H4 C1.8 16 0 14.2 0 12 V4 C0 1.8 1.8 0 4 0 Z"
          fill="#850B10"
        />
        {/* Inner Fine Gold/Cream Border */}
        <path
          d="M6 3 H40 C41.1 3 42 3.9 42 5 V11 C42 12.1 41.1 13 40 13 H36 V67 H40 C41.1 67 42 67.9 42 69 V75 C42 76.1 41.1 77 40 77 H6 C4.9 77 4 76.1 4 75 V69 C4 67.9 4.9 67 6 67 H10 V13 H6 C4.9 13 4 12.1 4 11 V5 C4 3.9 4.9 3 6 3 Z"
          stroke="#FFF7E8"
          strokeWidth="1.2"
          strokeOpacity="0.9"
        />
      </svg>
      {/* Number centered in cream with serif font */}
      <span
        className="absolute inset-0 flex items-center justify-center font-bold text-lg sm:text-xl text-[#FFF7E8] tracking-tight"
        style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
      >
        {num}
      </span>
    </div>
  );
}

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
    <section className="relative w-full py-8 sm:py-12 lg:py-16 overflow-hidden select-none">
      {/* Decorative Traditional Clouds at bottom-left and bottom-right (matching design/image copy.png) */}
      <div className="absolute -bottom-10 -left-12 w-64 sm:w-80 opacity-40 pointer-events-none select-none z-0">
        <img
          src="/home-assets/cloud_1.png"
          alt=""
          className="w-full h-auto object-contain filter sepia(0.8) saturate(2.5) hue-rotate(5deg) brightness(1.15)"
        />
      </div>
      <div className="absolute -bottom-12 -right-12 w-72 sm:w-96 opacity-40 pointer-events-none select-none z-0">
        <img
          src="/home-assets/cloud_2.png"
          alt=""
          className="w-full h-auto object-contain filter sepia(0.8) saturate(2.5) hue-rotate(5deg) brightness(1.15)"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* ================= LEFT COLUMN (matching design/image copy.png) ================= */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-3.5 sm:space-y-4">
            {/* Red Cartouche Badge */}
            <div className="inline-block">
              <span className="inline-flex items-center px-4 sm:px-5 py-1 sm:py-1.5 rounded-full bg-[#850B10] text-[#FFFDF5] text-xs sm:text-sm font-bold tracking-wide shadow-md">
                Tại sao chọn Sử Học Số?
              </span>
            </div>

            {/* Main 3-line Headline: Black lines 1-2, Crimson Red line 3 */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[1.85rem] xl:text-[2.15rem] font-black font-serif-royal leading-[1.3] tracking-tight uppercase space-y-1">
              <span className="text-[#1A120B] block whitespace-nowrap">ĐƯỢC XÂY DỰNG CHO</span>
              <span className="text-[#1A120B] block whitespace-nowrap">CÔNG VIỆC THẬT CỦA</span>
              <span className="text-[#850B10] block whitespace-nowrap">GIÁO VIÊN & HỌC SINH</span>
            </h2>

            {/* Red Underline Divider */}
            <div className="w-24 sm:w-32 h-[2.5px] bg-[#850B10] rounded-full" />

            {/* Description Text */}
            <p className="text-xs sm:text-sm lg:text-[0.95rem] text-[#3A2A1A] leading-relaxed font-normal max-w-md lg:max-w-lg">
              Không chỉ là kho lưu trữ số, <strong className="font-bold text-[#1A120B]">Sử Ký Số</strong> mang đến hệ sinh thái học tập đa phương tiện tương tác, giúp việc dạy và học Lịch sử 10 trở nên trực quan, sinh động và tràn đầy cảm hứng.
            </p>
          </div>

          {/* ================= RIGHT COLUMN (matching design/image copy.png) ================= */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 sm:space-y-8">
            {points.map((p, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 sm:gap-6 group transition-transform duration-200 hover:translate-x-1"
              >
                {/* Traditional Vietnamese Tally Tag (Thẻ bài đỏ) */}
                <TraditionalTabletTag num={p.num} />

                {/* Feature Text */}
                <div className="flex-1 pt-1 min-w-0">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#1A120B] leading-snug group-hover:text-[#850B10] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A4A4A] mt-1.5 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
