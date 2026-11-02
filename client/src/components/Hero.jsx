import { Box, Search, Compass, BookOpen } from 'lucide-react';

export default function Hero({ searchQuery, setSearchQuery, onSearchSubmit, onOpenStudio3D }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#162238] text-white p-6 sm:p-9 shadow-sm border border-slate-700/60">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 mb-4">
          <BookOpen className="w-3.5 h-3.5 text-slate-300" /> Hệ Thống Học Liệu Số & Mô Phỏng 3D
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
          Khám Phá Dòng Chảy <span className="text-amber-200">Văn Minh Lịch Sử 10</span>
        </h1>

        <p className="mt-3 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-normal">
          Kho tư liệu lịch sử chuẩn hóa theo Chương trình GDPT 2018, tích hợp dữ liệu Nghiệp vụ Sư phạm chi tiết, hình ảnh khảo cổ học độ phân giải cao và Studio mô hình 3D tương tác.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(searchQuery);
          }}
          className="mt-6 flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm max-w-2xl border border-slate-200"
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
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition active:scale-95 shrink-0 cursor-pointer"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Quick Highlights / Shortcuts */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
          <span className="font-medium text-slate-400">Khám phá nhanh:</span>
          <button
            type="button"
            onClick={() => {
              const q = 'Văn minh Đông Nam Á';
              setSearchQuery(q);
              onSearchSubmit(q);
            }}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition border border-white/10 text-xs font-medium cursor-pointer"
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
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition border border-white/10 text-xs font-medium cursor-pointer"
          >
            Văn hóa Đông Sơn
          </button>
          <button
            type="button"
            onClick={onOpenStudio3D}
            className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-amber-200 font-semibold transition border border-white/20 flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" /> Studio Cổ Vật 3D
          </button>
        </div>
      </div>
    </div>
  );
}
