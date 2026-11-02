import React from 'react';
import { useParams, NavLink, Link } from 'react-router-dom';
import {
  GraduationCap, CheckCircle2, FileText, Sparkles, Layers, BookOpen,
  ExternalLink, Lightbulb, HelpCircle, Award
} from 'lucide-react';

export default function TeachersView({ onExploreTopic }) {
  const { tab = 'cam-nang' } = useParams();

  const teacherTabs = [
    { to: '/giao-vien/cam-nang', id: 'cam-nang', label: 'Cẩm Nang Sư Phạm', icon: BookOpen },
    { to: '/giao-vien/ke-hoach-5512', id: 'ke-hoach-5512', label: 'Kế Hoạch Bài Dạy 5512', icon: FileText },
    { to: '/giao-vien/ngan-hang-cau-hoi', id: 'ngan-hang-cau-hoi', label: 'Ngân Hàng Câu Hỏi & Đề Kiểm Tra', icon: HelpCircle }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy to-navy-light text-white p-8 rounded-3xl shadow-xl border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold/20 text-gold-light border border-gold/30 mb-3">
          <GraduationCap className="w-4 h-4" /> Không Gian Sư Phạm Lịch Sử 10
        </div>
        <h2 className="text-3xl font-black tracking-tight">
          Cẩm Nang Khai Thác Tư Liệu Cho Giáo Viên
        </h2>
        <p className="mt-2 text-slate-200 text-sm leading-relaxed max-w-3xl">
          Định hướng tổ chức dạy học phát triển năng lực môn Lịch sử theo Chương trình GDPT 2018. Khai thác hiệu quả các nguồn sử liệu hình ảnh, bia ký và mô hình 3D trong bài dạy.
        </p>

        {/* Sub-Tab Navigation with Real Slugs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/15">
          {teacherTabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <NavLink
                key={t.to}
                to={t.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-gold text-slate-950 shadow-md font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* TAB 1: CẨM NANG SƯ PHẠM */}
      {tab === 'cam-nang' && (
        <div className="space-y-6">
          {/* 4 Pillars of Historical Competence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-800">
                Tìm hiểu và Giải mã Tư liệu Lịch sử
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Sử dụng các hiện vật (như Trống đồng Ngọc Lũ, Bia Võ Cạnh, Nhẫn vàng Óc Eo) để học sinh trực tiếp quan sát, nhận diện nguồn gốc, chất liệu và bối cảnh lịch sử thay vì chỉ đọc qua kênh chữ SGK.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-800">
                Tái hiện & Nhận thức Không gian – Thời gian
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Kết hợp Quả cầu 3D Hải trình Đông Nam Á để học sinh định vị các cảng thị cổ (Óc Eo, Srivijaya), nhận thức được vai trò của gió mùa và các tuyến giao thương đường biển trong việc tiếp nhận tôn giáo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="font-extrabold text-base text-slate-800">
                Tư duy Phản biện & So sánh Lịch sử
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                So sánh sự tiếp biến tôn giáo: cách người Campuchia xây dựng Angkor Wat, người Indonesia xây Borobudur, người Chăm điêu khắc đài thờ Mỹ Sơn và người Việt tiếp thu Phật giáo Đại thừa.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                4
              </div>
              <h3 className="font-extrabold text-base text-slate-800">
                Giáo dục Ý thức Bảo tồn Di sản
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Nâng cao trách nhiệm công dân đối với việc giữ gìn và phát huy các bảo vật quốc gia, di sản văn hóa thế giới trước tác động của chiến tranh, thời gian và thương mại hóa.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KẾ HOẠCH BÀI DẠY 5512 */}
      {tab === 'ke-hoach-5512' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                Khung kế hoạch bài dạy mẫu (Phụ lục IV Công văn 5512/BGDĐT)
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Chuyên đề: Văn minh Đông Nam Á thời cổ – trung đại
              </h3>
            </div>
            <Link
              to="/kho-tu-lieu?topic=4"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-navy text-white hover:bg-navy-light transition shadow"
            >
              Mở kho tư liệu Chủ đề 4
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <h4 className="font-bold text-sm text-navy mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Hoạt động 1: Khởi động (Xác định vấn đề học tập)</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                <strong>Kỹ thuật:</strong> Trình chiếu mô hình 3D Trống đồng Ngọc Lũ và Quả cầu 3D Hải trình biển. Yêu cầu học sinh quan sát trong 2 phút và viết ra 3 điều ấn tượng nhất về trình độ của người xưa.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <h4 className="font-bold text-sm text-navy mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Hoạt động 2: Hình thành kiến thức mới (Khám phá tư liệu)</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                <strong>Phương pháp chuyên gia:</strong> Chia lớp thành 4 nhóm nghiên cứu 4 trạm di sản số: Trạm 1 (Angkor Wat), Trạm 2 (Borobudur), Trạm 3 (Thánh địa Mỹ Sơn), Trạm 4 (Óc Eo Phù Nam). Học sinh tổng hợp phiếu học tập qua website.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <h4 className="font-bold text-sm text-navy mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Hoạt động 3: Luyện tập & Đánh giá năng lực</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Học sinh làm bài trắc nghiệm tương tác trực tuyến trên hệ thống, phân tích các bức phù điêu để giải mã ảnh hưởng của văn hóa Ấn Độ.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM */}
      {tab === 'ngan-hang-cau-hoi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Ngân Hàng Câu Hỏi Trắc Nghiệm Đánh Giá Theo Mức Độ
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Phân theo 4 cấp độ nhận thức: Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-2">
              <span className="font-bold text-blue-700 uppercase tracking-wider text-[10px]">Cấp độ 1: Nhận biết</span>
              <p className="font-bold text-slate-800">
                Câu 1: Bản khắc chữ Phạn (Sanskrit) cổ nhất tìm thấy ở Đông Nam Á có tên là gì?
              </p>
              <div className="text-slate-600 pl-3">
                A. Bia Ramkhamhaeng • <strong>B. Bia Võ Cạnh (Khánh Hòa) [Đúng]</strong> • C. Bia Đồng Yên Châu • D. Bia Tiến sĩ Văn Miếu
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2">
              <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px]">Cấp độ 2: Thông hiểu</span>
              <p className="font-bold text-slate-800">
                Câu 2: Hình ảnh ngôi sao 14 cánh ở tâm mặt Trống đồng Ngọc Lũ thể hiện tín ngưỡng gì của cư dân Việt cổ?
              </p>
              <div className="text-slate-600 pl-3">
                A. Sùng bái thần núi • <strong>B. Tín ngưỡng sùng bái Mặt Trời và nông nghiệp lúa nước [Đúng]</strong> • C. Tín ngưỡng phồn thực • D. Thờ cúng tổ tiên
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
              <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px]">Cấp độ 3 & 4: Vận dụng & Vận dụng cao</span>
              <p className="font-bold text-slate-800">
                Câu 3: Việc phát hiện đồng tiền vàng La Mã thế kỷ II tại di chỉ Óc Eo (An Giang) chứng minh điều gì về nền kinh tế Phù Nam?
              </p>
              <div className="text-slate-600 pl-3">
                <strong>Đáp án định hướng:</strong> Chứng minh Phù Nam là một quốc gia thương mại hàng hải quốc tế hùng mạnh, nắm giữ trục xoay hải trình Con đường Tơ lụa trên biển kết nối trực tiếp với phương Tây và Nam Á.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
