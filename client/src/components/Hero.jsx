import { Box, Search, Sparkles } from 'lucide-react';

export default function Hero({ searchQuery, setSearchQuery, onSearchSubmit, onOpenStudio3D }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-dark via-navy to-[#1f3764] text-white p-8 sm:p-10 shadow-xl border border-white/10">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e6ad4c_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-gold/20 text-gold-light border border-gold/30 mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" /> Hệ Thống Học Liệu Số & Mô Phỏng 3D
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          Khám Phá Dòng Chảy <span className="text-gold">Văn Minh Lịch Sử 10</span>
        </h1>

        <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
          Kho tư liệu lịch sử chuẩn hóa theo Chương trình GDPT 2018, tích hợp dữ liệu Nghiệp vụ Sư phạm chi tiết, hình ảnh khảo cổ học độ phân giải cao và Studio mô hình 3D tương tác.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="mt-6 flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl max-w-2xl border border-white/20"
        >
          <div className="pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hiện vật (Trống đồng, Angkor, Óc Eo, Bia Võ Cạnh...)"
            className="w-full bg-transparent px-2 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-bold text-xs transition active:scale-95 shadow shrink-0"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Quick Highlights / Shortcuts */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="font-semibold text-slate-400">Khám phá nhanh:</span>
          <button
            onClick={() => {
              setSearchQuery('Văn minh Đông Nam Á');
              onSearchSubmit();
            }}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md border border-white/10"
          >
            🌏 Đông Nam Á Cổ – Trung Đại
          </button>
          <button
            onClick={() => {
              setSearchQuery('Trống đồng');
              onSearchSubmit();
            }}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md border border-white/10"
          >
            🥁 Văn hóa Đông Sơn
          </button>
          <button
            onClick={onOpenStudio3D}
            className="px-3 py-1 rounded-full bg-gold/25 hover:bg-gold/40 text-gold-light font-bold transition backdrop-blur-md border border-gold/40 flex items-center gap-1.5"
          >
            <Box className="w-3.5 h-3.5" /> Studio Cổ Vật 3D
          </button>
        </div>
      </div>
    </div>
  );
}

