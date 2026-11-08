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
      {/* 1. BACKGROUND LAYERS: MISTY CLOUDS                             */}
      {/* ============================================================== */}
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
      {/* Left ancient_house (Chỉ hé lộ góc mái rồng uốn lượn ở rìa mép) */}
      <div className="absolute top-0 bottom-0 left-0 pointer-events-none z-20 animate-slide-left-motif flex items-center">
        <img
          src="/home-assets/ancient_house.png"
          alt="ancient_house"
          className="h-[75vh] sm:h-[84vh] md:h-[90vh] lg:h-[94vh] w-auto max-w-none object-contain -translate-x-[86%] sm:-translate-x-[84%] md:-translate-x-[83%] lg:-translate-x-[82%]"
        />
      </div>

      {/* Right ancient_house (flipped horizontally) */}
      <div className="absolute top-0 bottom-0 right-0 pointer-events-none z-20 animate-slide-right-motif flex items-center">
        <img
          src="/home-assets/ancient_house.png"
          alt="ancient_house"
          className="h-[75vh] sm:h-[84vh] md:h-[90vh] lg:h-[94vh] w-auto max-w-none object-contain translate-x-[86%] sm:translate-x-[84%] md:translate-x-[83%] lg:translate-x-[82%] scale-x-[-1]"
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
      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center justify-center animate-text-reveal">
        {/* Top Subtitle */}
        <div className="w-full flex justify-center mb-1 sm:mb-2">
          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-black uppercase tracking-[0.14em] text-[#FDE2A7] hero-subtitle select-text">
            HỆ THỐNG HỌC LIỆU SỐ & MÔ PHỎNG 3D
          </h2>
        </div>

        {/* Main Calligraphic Title "Sử Học Số" */}
        <div className="w-full flex justify-center my-0.5 sm:my-1 lg:my-2">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] 2xl:text-[11.5rem] font-black text-[#FFFDF5] hero-main-title tracking-tight leading-none select-text">
            Sử Học Số
          </h1>
        </div>

        {/* Bottom Subtitle */}
        <div className="w-full flex justify-center mt-1 sm:mt-2 mb-6 sm:mb-8 md:mb-10">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-black uppercase tracking-[0.12em] text-[#FDE2A7] hero-subtitle select-text">
            ĐƯA LỊCH SỬ ĐẾN GẦN HƠN BẰNG CÔNG NGHỆ SỐ
          </p>
        </div>

        {/* Call-to-action Button: BẮT ĐẦU TRẢI NGHIỆM ▶ */}
        <div>
          <button
            type="button"
            onClick={handleStartExperience}
            className="px-8 sm:px-12 py-3 sm:py-3.5 bg-white hover:bg-[#FFFDF5] text-[#850B10] font-black text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-[0_4px_25px_rgba(0,0,0,0.55)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.75)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
            style={{ borderRadius: '2px' }}
          >
            <span className="font-extrabold tracking-[0.06em]">BẮT ĐẦU TRẢI NGHIỆM</span>
            <span className="text-[#850B10] text-sm sm:text-base leading-none">▶</span>
          </button>
        </div>
      </div>
    </section>
  );
}
