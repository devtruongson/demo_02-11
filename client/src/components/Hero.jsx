import React, { useState, useEffect } from 'react';
import { Box, Search, BookOpen, Sliders, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function Hero({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onOpenStudio3D,
  bannerSlides = [],
  onOpenBannerConfig,
  isAdmin = false
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Active slides only
  const activeSlides = bannerSlides.filter((s) => s.is_active);
  const hasSlides = activeSlides.length > 0;

  // Auto rotate carousel every 5.5s (pauses on hover or when focusing in search bar)
  useEffect(() => {
    if (!hasSlides || activeSlides.length <= 1 || isHovered || isFocused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [hasSlides, activeSlides.length, isHovered, isFocused]);

  // Keep index within bounds if slides change
  useEffect(() => {
    if (currentSlideIndex >= activeSlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeSlides.length, currentSlideIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (!hasSlides) return;
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (!hasSlides) return;
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const activeSlide = hasSlides ? activeSlides[currentSlideIndex] : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-3xl overflow-hidden bg-[#162238] text-white p-6 sm:p-9 shadow-sm border border-slate-700/60 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between transition-all"
    >
      {/* ============================================================== */}
      {/* 1. BACKGROUND CAROUSEL (IF ACTIVE SLIDES EXIST)                 */}
      {/* ============================================================== */}
      {hasSlides ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image_url}
                  alt={slide.title || 'Banner Slide'}
                  className={`w-full h-full object-cover brightness-[0.38] contrast-[1.08] transition-transform duration-[7000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1200';
                  }}
                />
              </div>
            );
          })}

          {/* Double Layer Readability Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1424]/95 via-[#0c1424]/85 to-[#0c1424]/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/95 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : null}

      {/* Admin Banner Management Quick Action Trigger */}
      {isAdmin && onOpenBannerConfig && (
        <button
          type="button"
          onClick={onOpenBannerConfig}
          title="Cấu hình hình ảnh trình chiếu Banner (Carousel)"
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition cursor-pointer shadow-sm active:scale-95"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Cấu hình Banner ({activeSlides.length})</span>
        </button>
      )}

      {/* ============================================================== */}
      {/* 2. FOREGROUND CONTENT (PERFECT CONTRAST & LEGIBILITY)          */}
      {/* ============================================================== */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 mb-4 backdrop-blur-xs">
          <BookOpen className="w-3.5 h-3.5 text-slate-300" /> Hệ Thống Học Liệu Số & Mô Phỏng 3D
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
          {activeSlide?.title ? (
            activeSlide.title
          ) : (
            <>
              Khám Phá Di Sản & <span className="text-amber-200">Dòng Chảy Lịch Sử 10</span>
            </>
          )}
        </h1>

        <p className="mt-3 text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-normal drop-shadow-xs">
          Kho tư liệu lịch sử chuẩn hóa theo Chương trình GDPT 2018, tích hợp dữ liệu Nghiệp vụ Sư phạm chi tiết, hình ảnh khảo cổ học độ phân giải cao và Studio mô hình 3D tương tác.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(searchQuery);
          }}
          className="mt-6 flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-lg max-w-2xl border border-slate-200/90"
        >
          <div className="pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hiện vật (Trống đồng, Angkor, Óc Eo, Bia Võ Cạnh...)"
            className="w-full bg-transparent px-2 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition active:scale-95 shrink-0 cursor-pointer shadow-xs"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Quick Highlights / Shortcuts */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs text-slate-200">
          <span className="font-medium text-slate-300">Khám phá nhanh:</span>
          <button
            type="button"
            onClick={() => {
              const q = 'Văn minh Đông Nam Á';
              setSearchQuery(q);
              onSearchSubmit(q);
            }}
            className="px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-slate-200 transition border border-white/15 text-xs font-medium cursor-pointer"
          >
            Đông Nam Á Cổ – Trung Đại
          </button>
          <button
            type="button"
            onClick={() => {
              const q = 'Trống đồng';
              setSearchQuery(q);
              onSearchSubmit(q);
            }}
            className="px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-slate-200 transition border border-white/15 text-xs font-medium cursor-pointer"
          >
            Văn hóa Đông Sơn
          </button>
          <button
            type="button"
            onClick={onOpenStudio3D}
            className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-amber-200 font-semibold transition border border-white/20 flex items-center gap-1.5 text-xs cursor-pointer backdrop-blur-xs"
          >
            <Box className="w-3.5 h-3.5" /> Studio Cổ Vật 3D
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CAROUSEL CONTROLS & CAPTION (AT BOTTOM)                    */}
      {/* ============================================================== */}
      {hasSlides && (
        <div className="relative z-10 mt-6 pt-3 flex items-center justify-between gap-3 text-xs border-t border-white/10">
          {/* Slide Caption Pill */}
          <div className="min-w-0 flex items-center gap-2">
            {activeSlide?.title ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-[280px] sm:max-w-md">
                <ImageIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="truncate">{activeSlide.title}</span>
                {activeSlide.subtitle && (
                  <span className="text-slate-400 hidden sm:inline">• {activeSlide.subtitle}</span>
                )}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Trình chiếu di sản số</span>
            )}
          </div>

          {/* Carousel Navigation: Dots + Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Prev Arrow */}
            {activeSlides.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                title="Slide trước"
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs border border-white/15 flex items-center justify-center text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Dots */}
            {activeSlides.length > 1 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/30 backdrop-blur-xs border border-white/10">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    title={`Chuyển đến slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'w-5 h-1.5 bg-amber-300'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Next Arrow */}
            {activeSlides.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                title="Slide tiếp theo"
                className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs border border-white/15 flex items-center justify-center text-white transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
