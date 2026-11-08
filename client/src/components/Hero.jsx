import React from 'react';

export default function Hero() {
  const handleStartExperience = () => {
    const target = document.getElementById('chuc-nang-chinh');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] min-h-[560px] sm:min-h-[640px] bg-gradient-to-b from-[#8B0B10] via-[#7B080D] to-[#5C0407] text-white flex flex-col justify-center items-center overflow-hidden select-none">
      {/* ============================================================== */}
      {/* 1. BACKGROUND LAYERS: DONG SON PATTERNS & MISTY CLOUDS        */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url('/home-assets/Dong_Son_patterns.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Floating traditional clouds top & bottom */}
      <div className="absolute top-4 left-12 w-48 sm:w-64 opacity-20 pointer-events-none">
        <img src="/home-assets/cloud_1.png" alt="" className="w-full h-auto" />
      </div>
      <div className="absolute bottom-8 right-12 w-56 sm:w-72 opacity-20 pointer-events-none">
        <img src="/home-assets/cloud_2.png" alt="" className="w-full h-auto" />
      </div>

      {/* ============================================================== */}
      {/* 2. SIDE ANCIENT_HOUSE MOTIFS SLIDING IN (animation.mp4)        */}
      {/* Chỉ hiện 1 góc nhỏ ở mép 2 bên, vươn cao dọc viền màn hình     */}
      {/* ============================================================== */}
      {/* Left ancient_house */}
      <div className="absolute top-0 bottom-0 left-0 w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52 pointer-events-none z-20 animate-slide-left-motif overflow-hidden">
        <img
          src="/home-assets/ancient_house.png"
          alt="ancient_house"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[75vh] sm:h-[84vh] md:h-[90vh] lg:h-[94vh] w-auto max-w-none object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.92)] translate-x-0"
        />
      </div>

      {/* Right ancient_house (flipped horizontally) */}
      <div className="absolute top-0 bottom-0 right-0 w-20 sm:w-28 md:w-36 lg:w-44 xl:w-52 pointer-events-none z-20 animate-slide-right-motif overflow-hidden">
        <img
          src="/home-assets/ancient_house.png"
          alt="ancient_house"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[75vh] sm:h-[84vh] md:h-[90vh] lg:h-[94vh] w-auto max-w-none object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.92)] translate-x-0 scale-x-[-1]"
        />
      </div>

      {/* ============================================================== */}
      {/* 3. CHIM LẠC FLYING ACROSS HORIZONTALLY (Slide 6 & animation.mp4)*/}
      {/* Con chim xuất hiện và bay ngang qua màn hình                    */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden flex items-center justify-center">
        <div className="w-64 sm:w-80 md:w-[420px] lg:w-[500px] animate-bird-flight filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]">
          <img
            src="/home-assets/bird.png"
            alt="Chim Lạc Đông Sơn"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. CENTER CONTENT REVEALED BEHIND THE BIRD (animation.mp4)     */}
      {/* Đằng sau con chim là phần chữ được kéo cùng - Căn giữa thoáng  */}
      {/* ============================================================== */}
      <div className="relative z-10 max-w-3xl lg:max-w-4xl mx-auto px-10 sm:px-20 md:px-28 lg:px-36 text-center flex flex-col items-center justify-center space-y-3.5 sm:space-y-5 animate-text-reveal">
        {/* Top Subtitle */}
        <div>
          <h2 className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#FDE2A7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-serif-cinzel">
            HỆ THỐNG HỌC LIỆU SỐ & MÔ PHỎNG 3D
          </h2>
        </div>

        {/* Main Calligraphic Title */}
        <div className="py-0.5 sm:py-1">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#FFFDF8] font-serif-royal drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] tracking-tight leading-none">
            Sử Học Số
          </h1>
        </div>

        {/* Subtitle */}
        <div className="max-w-xl mx-auto">
          <p className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-[#FDE2A7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-serif-cinzel leading-relaxed">
            ĐƯA LỊCH SỬ ĐẾN GẦN HƠN BẰNG CÔNG NGHỆ SỐ
          </p>
        </div>

        {/* Call-to-action Button: BẮT ĐẦU TRẢI NGHIỆM ▶ */}
        <div className="pt-2 sm:pt-4">
          <button
            type="button"
            onClick={handleStartExperience}
            className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-md bg-[#FFFDF8] hover:bg-white text-[#8B0B10] font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-amber-300/40 cursor-pointer"
          >
            <span>BẮT ĐẦU TRẢI NGHIỆM</span>
            <span className="text-[#8B0B10] text-xs">▶</span>
          </button>
        </div>
      </div>
    </section>
  );
}
