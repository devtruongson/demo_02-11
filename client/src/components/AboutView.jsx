import React from 'react';
import { Info, Database, Code, Globe, Shield, Sparkles, BookOpen } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* About Banner */}
      <div className="bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] text-white p-8 rounded-3xl shadow-lg border border-amber-300/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-[#FDE2A7] border border-amber-300/40 mb-3">
            <Info className="w-4 h-4 text-[#FDE2A7]" /> Về Dự Án "Sử Ký Số"
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-serif-royal">
            Số Hóa Tư Liệu & Trực Quan Hóa Lịch Sử 10
          </h2>
          <p className="mt-2 text-[#FFF7E8]/90 text-sm leading-relaxed font-normal">
            Hệ thống được phát triển nhằm giải quyết tình trạng thiếu hụt tư liệu khảo cổ trực quan và mô phỏng 3D sinh động trong quá trình giảng dạy môn Lịch sử lớp 10 theo định hướng phát triển phẩm chất, năng lực của Chương trình GDPT 2018.
          </p>
        </div>
      </div>

      {/* Platform Capabilities */}
      <div className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 border border-[#EBDBC5] shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-[#2D1B08] flex items-center gap-2 font-serif-royal">
          <Sparkles className="w-5 h-5 text-[#850B10]" />
          <span>Năng Lực & Trải Nghiệm Học Liệu Số Hóa</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#EBDBC5] space-y-2">
            <div className="font-bold text-[#850B10] text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#850B10]"></span>
              <span>Trải Nghiệm Học Tập Tương Tác</span>
            </div>
            <ul className="space-y-1.5 text-stone-700 list-disc list-inside">
              <li><strong>Không gian 3D cổ vật:</strong> Dựng mô hình tương tác 360 độ các bảo vật quốc gia và mô phỏng quả cầu hải trình thương mại di sản.</li>
              <li><strong>Giao diện sư phạm trực quan:</strong> Thiết kế trang nhã, tối ưu trên màn hình máy chiếu lớp học, máy tính bảng và máy tính cá nhân.</li>
              <li><strong>Đa phương tiện phong phú:</strong> Tích hợp các bộ sưu tập hình ảnh khảo cổ học độ nét cao cùng video tư liệu bài học sống động.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#EBDBC5] space-y-2">
            <div className="font-bold text-emerald-800 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Quản Trị Học Liệu & An Toàn Dữ Liệu</span>
            </div>
            <ul className="space-y-1.5 text-stone-700 list-disc list-inside">
              <li><strong>Chuẩn hóa GDPT 2018:</strong> Hệ sinh thái học liệu gắn liền với khung chương trình và sách giáo khoa Lịch sử 10 mới.</li>
              <li><strong>Quản trị & Phân quyền sư phạm:</strong> Phân chia quyền hạn minh bạch giữa giáo viên giảng dạy, học sinh tra cứu và ban quản trị.</li>
              <li><strong>Lưu trữ an toàn & Ổn định:</strong> Dữ liệu học liệu số và hình ảnh tải lên được bảo vệ, đồng bộ tự động và sẵn sàng tra cứu.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Academic Sources */}
      <div className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-8 border border-[#EBDBC5] shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#2D1B08] flex items-center gap-2 font-serif-royal">
          <BookOpen className="w-5 h-5 text-[#850B10]" />
          <span>Nguồn Dữ Liệu Học Thuật & Bản Quyền</span>
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed font-normal">
          Dữ liệu trong hệ thống được biên soạn dựa trên đề tài Nghiệp vụ Sư phạm Lịch sử, kết hợp thẩm định thông tin từ các cơ quan bảo tồn di sản uy tín:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-800">
          <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#EBDBC5]">
            🏛️ <strong>Bảo tàng Lịch sử Quốc gia Việt Nam (BTLSQG)</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#EBDBC5]">
            🌐 <strong>Trung tâm Di sản Thế giới UNESCO (World Heritage Centre)</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#EBDBC5]">
            🏰 <strong>Ban Quản lý Di sản Văn hóa Mỹ Sơn (Quảng Nam)</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#EBDBC5]">
            📚 <strong>Bách khoa toàn thư Britannica & Tư liệu Di sản ASEAN</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

