import React from 'react';

export default function Hero() {
  const handleStartExperience = () => {
    const target = document.getElementById('chuc-nang-chinh');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] min-h-[560px] sm:min-h-[640px] bg-[#8B0B10] bg-cover bg-center text-white flex flex-col justify-center items-center overflow-hidden select-none"
      style={{ backgroundImage: "url('/home-assets/bg-banner.jpeg')" }}
    >
      {/* Subtle depth vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25 pointer-events-none z-0" />

      {/* ============================================================== */}
      {/* 1. BACKGROUND LAYERS: MISTY CLOUDS                             */}
      {/* ============================================================== */}
      {/* Floating traditional clouds top-left & bottom-right (design/image.png) */}
      <div className="absolute -top-4 sm:-top-8 md:-top-12 lg:-top-16 -left-6 sm:-left-10 md:-left-16 w-[380px] sm:w-[540px] md:w-[700px] lg:w-[850px] xl:w-[980px] max-w-none opacity-[0.085] pointer-events-none select-none z-0">
        <img src="/home-assets/cloud_1.png" alt="" className="w-full h-auto object-contain" />
      </div>
      <div className="absolute -bottom-6 sm:-bottom-10 md:-bottom-14 lg:-bottom-18 -right-6 sm:-right-10 md:-right-16 w-[400px] sm:w-[560px] md:w-[740px] lg:w-[890px] xl:w-[1020px] max-w-none opacity-[0.085] pointer-events-none select-none z-0">
        <img src="/home-assets/cloud_2.png" alt="" className="w-full h-auto object-contain" />
      </div>

      {/* ============================================================== */}
      {/* 2. SIDE ANCIENT_HOUSE & LACQUER PILLARS (media & animation)   */}
      {/* Cột trụ sơn son tròn 3D chạy dọc mép + Mái nhà rồng vươn ra     */}
      {/* ============================================================== */}
      {/* Left side motif: Lacquer pillar + Left ancient_house */}
      <div className="absolute top-0 bottom-0 left-0 pointer-events-none z-10 animate-slide-left-motif flex items-center">
        {/* Left red lacquer pillar (Cột đỏ bóng sáng trắng 3D, không viền đen) */}
        <div
          className="absolute top-0 bottom-0 left-0 w-10 sm:w-12 md:w-14 lg:w-16 xl:w-20 h-full z-0"
          style={{
            background: 'linear-gradient(90deg, #78080C 0%, #9E0D14 15%, #C91A23 32%, #E83642 42%, #FFA8B0 48%, #FFFFFF 53%, #FFCCD2 58%, #D8222C 72%, #8F0C12 88%, #70070B 100%)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)'
          }}
        />

        {/* Left ancient_house (Mái ngói rồng uốn lượn vươn từ sau cột vào) */}
        <img
          src="/home-assets/ancient_house.png"
          alt="ancient_house"
          className="relative z-10 h-[75vh] sm:h-[84vh] md:h-[90vh] lg:h-[94vh] w-auto max-w-none object-contain -translate-x-[88%] sm:-translate-x-[84%] md:-translate-x-[83%] lg:-translate-x-[82%]"
        />
      </div>

      {/* Right side motif: Lacquer pillar + Right ancient_house (flipped horizontally) */}
      <div className="absolute top-0 bottom-0 right-0 pointer-events-none z-10 animate-slide-right-motif flex items-center">
        {/* Right red lacquer pillar (Cột đỏ bóng sáng trắng 3D, không viền đen) */}
        <div
          className="absolute top-0 bottom-0 right-0 w-10 sm:w-12 md:w-14 lg:w-16 xl:w-20 h-full z-0"
          style={{
            background: 'linear-gradient(270deg, #78080C 0%, #9E0D14 15%, #C91A23 32%, #E83642 42%, #FFA8B0 48%, #FFFFFF 53%, #FFCCD2 58%, #D8222C 72%, #8F0C12 88%, #70070B 100%)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)'
          }}
        />

        {/* Right ancient_house (Trên mobile thụt vào cân đối 88% giống bên trái) */}
        <img
          src="/home-assets/ancient_house.png"
          alt="ancient_house"
          className="relative z-10 h-[75vh] sm:h-[84vh] md:h-[90vh] lg:h-[94vh] w-auto max-w-none object-contain translate-x-[88%] sm:translate-x-[76%] md:translate-x-[75%] lg:translate-x-[74%] scale-x-[-1]"
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
      <div className="relative z-20 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center justify-center animate-text-reveal">
        {/* Top Subtitle */}
        <div className="w-full flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-black uppercase tracking-[0.14em] text-[#FDE2A7] hero-subtitle select-text">
            HỆ THỐNG HỌC LIỆU SỐ & MÔ PHỎNG 3D
          </h2>
        </div>

        {/* Main Calligraphic Title "Sử Học Số" */}
        <div className="w-full flex justify-center py-3 sm:py-4 md:py-6">
          <h1 className="hero-main-title title text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.5rem] 2xl:text-[6.25rem] text-[#FFFDF5] tracking-tight leading-[1.25] sm:leading-[1.3] select-text whitespace-nowrap">
            Sử Học Số
          </h1>
        </div>

        {/* Bottom Subtitle */}
        <div className="w-full flex justify-center mt-5 sm:mt-7 md:mt-9 lg:mt-11 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-black uppercase tracking-[0.12em] text-[#FDE2A7] hero-subtitle select-text">
            ĐƯA LỊCH SỬ ĐẾN GẦN HƠN BẰNG CÔNG NGHỆ SỐ
          </p>
        </div>

        {/* Call-to-action Button: BẮT ĐẦU TRẢI NGHIỆM ▶ */}
        <div className="mt-1 sm:mt-2">
          <button
            type="button"
            onClick={handleStartExperience}
            className="px-8 sm:px-12 py-3.5 sm:py-4 bg-white hover:bg-[#FFFDF5] text-[#850B10] font-black text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-[0_4px_25px_rgba(0,0,0,0.55)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.75)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
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
