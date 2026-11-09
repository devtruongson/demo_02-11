import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Sparkles, Compass, PlusCircle, Edit3, ArrowLeft,
  ArrowRight, MapPin, Calendar, Layers, ShieldCheck, ChevronRight
} from 'lucide-react';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';
import GlobeViewer3D from './GlobeViewer3D.jsx';
import Artifact3DEditorModal from './Artifact3DEditorModal.jsx';

// 12 Curated Historical 3D Artifacts (matching design/image copy 15.png 6-column grid)
const DEFAULT_ARTIFACTS = [
  {
    id: 'art_1',
    code: 'dong_son_drum',
    name: 'Trống đồng Ngọc Lũ',
    culture: 'Văn hóa Đông Sơn',
    period: 'TK VII - VI TCN',
    location: 'Bảo tàng Lịch sử Quốc gia',
    material: 'Đồng thau đúc nguyên khối',
    dimensions: 'Đường kính 79cm, Chiều cao 63cm',
    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    description: 'Mặt trống đúc nổi hình ngôi sao 14 cánh, xen giữa là các họa tiết hình lông công, chim Lạc bay theo chiều ngược kim đồng hồ, cảnh giã gạo, múa vũ trang và nhà sàn mái cong truyền thống.',
    significance: 'Trống đồng Ngọc Lũ là đỉnh cao của nghệ thuật đúc đồng văn hóa Đông Sơn thời kỳ dựng nước Văn Lang - Âu Lạc. Hoa văn hình ngôi sao 14 cánh, chim Lạc bay, cảnh giã gạo và thuyền chiến phản ánh sâu sắc đời sống tâm linh, tín ngưỡng nông nghiệp lúa nước và tinh thần gắn kết cộng đồng của người Việt cổ.',
    embed: 'dong_son_drum'
  },
  {
    id: 'art_2',
    code: 'vo_canh_stele',
    name: 'Bia đá Võ Cạnh',
    culture: 'Văn hóa Chăm-pa cổ',
    period: 'Thế kỷ II - III',
    location: 'Khánh Hòa',
    material: 'Đá sa thạch tự nhiên',
    dimensions: 'Cao 270cm, Rộng 110cm',
    img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    description: 'Khối đá sa thạch hình trụ tam giác khắc chữ Phạn cổ (Sanskrit) ghi lại các chỉ dụ đạo đức và dòng dõi của vua Sri Mara.',
    significance: 'Tấm bia chữ Phạn cổ nhất được phát hiện tại khu vực Đông Nam Á, là cứ liệu khảo cổ học vô giá minh chứng cho quá trình tiếp biến văn hóa Ấn Độ và sự hình thành sớm của nhà nước cổ Chăm-pa.',
    embed: 'vo_canh_stele'
  },
  {
    id: 'art_3',
    code: 'banh_it_tower',
    name: 'Tháp Bánh Ít',
    culture: 'Văn hóa Chăm-pa',
    period: 'Thế kỷ XI - XII',
    location: 'Bình Định',
    material: 'Gạch nung và sa thạch điêu khắc',
    dimensions: 'Quần thể 4 tháp, tháp chính cao 29.6m',
    img: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
    description: 'Quần thể tháp Chăm tọa lạc trên đồi cao gồm tháp chính, tháp cổng, tháp hỏa và tháp bia với nghệ thuật chạm khắc hoa văn tinh xảo trên gạch nung.',
    significance: 'Đại diện tiêu biểu cho phong cách kiến trúc Bình Định thời kỳ chuyển tiếp, kết hợp hài hòa giữa vẻ uy nghiêm, đồ sộ và các đường nét trang trí uốn lượn mang đậm thế giới quan tôn giáo.',
    embed: 'banh_it_tower'
  },
  {
    id: 'art_4',
    code: 'borobudur_stupa',
    name: 'Đền tháp Borobudur',
    culture: 'Văn minh Đông Nam Á',
    period: 'Thế kỷ VIII - IX',
    location: 'Trung Java, Indonesia',
    material: 'Đá núi lửa andesite',
    dimensions: 'Đế vuông 123m x 123m, cao 35m',
    img: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
    description: 'Kỳ quan Phật giáo được xây dựng trên 9 tầng nền với 504 pho tượng Phật và hàng ngàn bức phù điêu tinh xảo.',
    significance: 'Quần thể đền tháp Phật giáo lớn nhất thế giới, minh chứng cho sự thăng hoa rực rỡ của nền văn minh Đông Nam Á thời kỳ hải thương hưng thịnh và giao lưu văn hóa quốc tế.',
    embed: 'borobudur_stupa'
  },
  {
    id: 'art_5',
    code: 'tuong_phat_a_di_da',
    name: 'Tượng Phật A Di Đà',
    culture: 'Đại Việt thời Lý',
    period: 'Thời Lý (Năm 1057)',
    location: 'Chùa Phật Tích, Bắc Ninh',
    material: 'Đá sa thạch xanh nguyên khối',
    dimensions: 'Chiều cao tổng thể 2.69m',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    description: 'Pho tượng ngồi kiết già trên tòa sen chạm khắc rồng thời Lý uốn lượn mềm mại, nếp áo buông rủ thanh thoát, khuôn mặt đượm vẻ từ bi.',
    significance: 'Tuyệt tác điêu khắc đá thời Lý, thể hiện nét thanh thoát, từ bi và trí tuệ của Phật giáo thời kỳ độc lập tự chủ, biểu trưng cho sự thái bình thịnh trị của văn minh Đại Việt.',
    embed: 'dong_son_drum'
  },
  {
    id: 'art_6',
    code: 'thap_dong_dao_thinh',
    name: 'Thạp đồng Đào Thịnh',
    culture: 'Văn hóa Đông Sơn',
    period: 'Khoảng 500 TCN',
    location: 'Yên Bái',
    material: 'Đồng thau đúc',
    dimensions: 'Cao 98cm, Miệng 61cm',
    img: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80',
    description: 'Chiếc thạp đồng lớn nhất thuộc văn hóa Đông Sơn, trên nắp gắn 4 khối tượng nam nữ giao hoan và thân thạp đúc nổi thuyền chiến, chim thú.',
    significance: 'Minh chứng tiêu biểu cho tín ngưỡng phồn thực nguyên thủy của cư dân nông nghiệp lúa nước, thể hiện khát vọng sinh sôi nảy nở của con người và vạn vật trước thiên nhiên.',
    embed: 'dong_son_drum'
  },
  {
    id: 'art_7',
    code: 'durga_my_son',
    name: 'Tượng Nữ thần Durga',
    culture: 'Văn hóa Chăm-pa',
    period: 'Thế kỷ VII',
    location: 'Mỹ Sơn, Quảng Nam',
    material: 'Sa thạch nguyên khối',
    dimensions: 'Cao 1.15m',
    img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80',
    description: 'Tượng khắc họa nữ thần Durga chiến thắng quỷ trâu Mahishasura với nét chạm khắc mềm mại, uy dũng và thần thái thanh cao.',
    significance: 'Bảo vật quốc gia phản ánh nghệ thuật điêu khắc sa thạch Chăm-pa thời kỳ hoàng kim, biểu trưng cho sức mạnh chính nghĩa tiêu diệt cái ác, bảo vệ trật tự vũ trụ.',
    embed: 'linga_yoni'
  },
  {
    id: 'art_8',
    code: 'binh_gom_hoa_lam',
    name: 'Bình gốm Chu Đậu',
    culture: 'Đại Việt thời Lê sơ',
    period: 'Thế kỷ XV',
    location: 'Nam Sách, Hải Dương',
    material: 'Gốm men tro trấu vẽ lam',
    dimensions: 'Cao 54cm',
    img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    description: 'Bình gốm dáng thiên nga với men trắng ngà hoa lam tinh xảo, vẽ họa tiết chim lạc, hoa sen, sóng nước và mây cuộn Đại Việt.',
    significance: 'Đỉnh cao của dòng gốm Chu Đậu nổi tiếng thế giới, từng theo chân các thương thuyền hải trình biển Đông vươn ra toàn cầu, minh chứng cho tài hoa thủ công và nền ngoại thương rực rỡ.',
    embed: 'dong_son_drum'
  },
  {
    id: 'art_9',
    code: 'cuu_dinh_hue',
    name: 'Cửu Đỉnh Cung Đình Huế',
    culture: 'Việt Nam thời Nguyễn',
    period: 'Năm 1835 (Thời Nguyễn)',
    location: 'Đại Nội Huế',
    material: 'Đồng thau đúc thủ công',
    dimensions: 'Gồm 9 đỉnh lớn nặng 1.9 - 2.6 tấn',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    description: 'Chín đỉnh đồng sừng sững trước sân Thế Miếu, đúc nổi 153 mảng phù điêu cảnh sắc non sông, bờ cõi biển đảo, sản vật và vũ khí của đất nước.',
    significance: 'Bộ bách khoa toàn thư bằng đồng đúc nổi hình tượng sông núi, biển Đông, Hoàng Sa, Trường Sa. Khẳng định chủ quyền thiêng liêng và ý chí trường tồn của dân tộc qua hàng thế kỷ.',
    embed: 'dong_son_drum'
  },
  {
    id: 'art_10',
    code: 'dai_hong_chung',
    name: 'Đại hồng chung Thiên Mụ',
    culture: 'Thời chúa Nguyễn',
    period: 'Năm 1710 (Chúa Nguyễn)',
    location: 'Chùa Thiên Mụ, Huế',
    material: 'Đồng hợp kim',
    dimensions: 'Cao 2.5m, nặng 2052kg',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    description: 'Chuông đồng đồ sộ với quai chuông hình đôi rồng uốn lượn, thân chuông khắc bài minh văn sâu sắc ca ngợi cảnh đẹp và cầu chúc quốc thái dân an.',
    significance: 'Kiệt tác đúc đồng thời chúa Nguyễn Phúc Chu với âm vang trầm ấm linh thiêng, gắn liền với biểu tượng tâm linh xứ Huế và tiến trình mở mang bờ cõi về phương Nam.',
    embed: 'dong_son_drum'
  },
  {
    id: 'art_11',
    code: 'ngai_vang_trieu_nguyen',
    name: 'Ngai vàng Triều Nguyễn',
    culture: 'Cung đình thời Nguyễn',
    period: 'Năm 1802',
    location: 'Điện Thái Hòa, Huế',
    material: 'Gỗ quý sơn son thếp vàng',
    dimensions: 'Cao 101cm, Rộng 72cm',
    img: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80',
    description: 'Ngai vua đặt dưới bửu tán lộng lẫy, chạm khắc hình rồng mây tinh vi theo phong cách "lưỡng long triều nhật" và hoa văn cung đình quý phái.',
    significance: 'Biểu tượng quyền lực quân chủ tối cao duy nhất còn nguyên vẹn ở Việt Nam, được sơn son thếp vàng với nghệ thuật chạm lộng đỉnh cao của các nghệ nhân cung đình Huế.',
    embed: 'dong_son_drum'
  },
  {
    id: 'art_12',
    code: 'quan_am_but_thap',
    name: 'Tượng Quan Âm Bút Tháp',
    culture: 'Thời Lê Trung hưng',
    period: 'Năm 1656',
    location: 'Chùa Bút Tháp, Bắc Ninh',
    material: 'Gỗ mít sơn son thếp vàng',
    dimensions: 'Cao 3.7m với 11 đầu, gần 1000 tay',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    description: 'Tuyệt tác điêu khắc tượng gỗ với các cánh tay tỏa tròn như vầng hào quang, lòng bàn tay khắc con mắt trí tuệ nhìn thấu vạn vật.',
    significance: 'Kiệt tác đỉnh cao của nghệ thuật tạc tượng gỗ cổ truyền Việt Nam do nghệ nhân Trương Thọ Nam sáng tạo, thể hiện tinh thần từ bi cứu khổ và triết lý dung hòa Phật - Nho - Đạo sâu sắc.',
    embed: 'dong_son_drum'
  }
];

// Bottom imperial wave ribbon decoration (matching design/image copy 15.png)
function RoyalWaveBottom() {
  return (
    <div className="w-full h-3 sm:h-3.5 bg-[#850B10] overflow-hidden relative select-none">
      <svg
        className="w-full h-full text-white"
        viewBox="0 0 100 16"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M 0,16 Q 12.5,4 25,16 Q 37.5,4 50,16 Q 62.5,4 75,16 Q 87.5,4 100,16"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M -12.5,16 Q 0,8 12.5,16 Q 25,8 37.5,16 Q 50,8 62.5,16 Q 75,8 87.5,16 Q 100,8 112.5,16"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.8"
          fill="none"
        />
      </svg>
    </div>
  );
}

// Stylized crimson imperial cloud decoration overlapping bottom-right of value box (matching design/image copy 16.png)
function RoyalRedCloudDecoration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 140 85"
      className={`w-20 h-12 sm:w-28 sm:h-16 text-[#850B10] fill-current drop-shadow-md select-none ${className}`}
    >
      <path
        d="M25 45 C15 45 8 52 8 60 C8 68 16 74 26 74 C40 74 60 74 110 74 C122 74 132 66 132 55 C132 44 121 38 112 39 C111 25 98 14 84 14 C73 14 63 20 58 30 C53 26 46 24 39 25 C26 27 16 38 25 45 Z"
      />
      <path
        d="M48 42 C48 36 53 31 59 31 C65 31 70 36 70 42 C70 48 65 52 59 52 C55 52 52 50 50 47"
        stroke="#FFF7E8"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M85 45 C85 38 91 32 98 32 C105 32 111 38 111 45 C111 52 105 57 98 57 C93 57 89 54 87 50"
        stroke="#FFF7E8"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 58 C24 54 27 51 31 51 C35 51 38 54 38 58 C38 62 35 64 31 64"
        stroke="#FFF7E8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Studio3DView({
  artifacts3d = [],
  currentUser = null,
  authToken = null,
  onArtifacts3DChange = null
}) {
  const { mode, artifactCode } = useParams();
  const navigate = useNavigate();

  const isGlobeMode = mode === 'hai-trinh-bien';

  // Merge real database items with default curated items
  const allArtifacts = [...artifacts3d];
  for (const def of DEFAULT_ARTIFACTS) {
    if (!allArtifacts.some((a) => a.code === def.code)) {
      allArtifacts.push(def);
    }
  }

  // Active artifact for Detail view
  const currentArtifact = artifactCode
    ? allArtifacts.find((a) => a.code === artifactCode) || allArtifacts[0]
    : null;

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorArtifact, setEditorArtifact] = useState(null);

  const isAdmin = currentUser?.role === 'admin';

  const handleOpenEdit = (art) => {
    setEditorArtifact(art || currentArtifact);
    setIsEditorOpen(true);
  };

  const handleOpenNew = () => {
    setEditorArtifact(null);
    setIsEditorOpen(true);
  };

  const handleSaveArtifact = async (formData, id) => {
    const url = id ? `/api/3d-artifacts/${id}` : '/api/3d-artifacts';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken ? `Bearer ${authToken}` : ''
      },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu bảo vật 3D');
    }
    if (onArtifacts3DChange) {
      await onArtifacts3DChange();
    }
    setIsEditorOpen(false);
    if (formData.code) {
      navigate(`/studio-3d/co-vat/${formData.code}`);
    }
  };

  // ================= VIEWPORT MODE 1: GLOBE 3D SEA ROUTE =================
  if (isGlobeMode) {
    return (
      <div
        className="w-full min-h-screen bg-[#FAF5EB] bg-repeat py-8 px-4 sm:px-6 lg:px-8 space-y-6"
        style={{ backgroundImage: "url('/home-assets/bg.png')" }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link
              to="/studio-3d"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EBDBC5] text-[#850B10] font-bold text-xs sm:text-sm hover:bg-stone-50 transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Studio 3D</span>
            </Link>
          </div>
          <GlobeViewer3D height="680px" />
        </div>
      </div>
    );
  }

  // ================= VIEWPORT MODE 2: ARTIFACT DETAIL VIEW (design/image copy 16.png) =================
  if (artifactCode && currentArtifact) {
    return (
      <div
        className="w-full min-h-screen bg-[#FAF5EB] bg-repeat py-8 sm:py-12 px-4 sm:px-6 lg:px-12 select-none"
        style={{ backgroundImage: "url('/home-assets/bg.png')" }}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Bar: Back to 3D Gallery & Sub-nav */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/studio-3d"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#850B10]/20 text-[#850B10] font-bold text-xs sm:text-sm hover:bg-[#FFF7E8] transition shadow-xs group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Quay lại Không gian 3D</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/studio-3d/hai-trinh-bien"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 border border-[#EBDBC5] text-stone-700 hover:text-[#850B10] text-xs font-bold transition shadow-xs"
              >
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Hải Trình Biển Đông</span>
              </Link>

              {isAdmin && (
                <button
                  onClick={() => handleOpenEdit(currentArtifact)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#850B10] text-white hover:bg-[#70070B] text-xs font-bold transition shadow-xs"
                >
                  <Edit3 className="w-4 h-4 text-amber-200" />
                  <span>Sửa 3D</span>
                </button>
              )}
            </div>
          </div>

          {/* Main 2-Column Layout matching design/image copy 16.png */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN: Large Square 3D Interactive Box */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-3">
              <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-xl border-2 border-[#850B10]/25 bg-gradient-to-b from-[#131a2a] via-[#101624] to-[#090d16] relative">
                <ThreeArtifactViewer
                  modelCode={currentArtifact.embed || currentArtifact.code}
                  artifactInfo={currentArtifact}
                  height="100%"
                  showControls={true}
                />
              </div>

              {/* Interaction Guide Caption below 3D Box */}
              <p className="text-xs sm:text-sm text-stone-800 font-medium text-left flex items-center justify-center lg:justify-start gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-[#850B10] shrink-0" />
                <span>Nhấn giữ chuột trái để xoay 360° • Cuộn chuột để phóng to/thu nhỏ</span>
              </p>
            </div>

            {/* RIGHT COLUMN: Artifact Details, Value Box & CTA Button */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              {/* Artifact Title */}
              <div>
                <h1 className="font-serif-royal text-[#850B10] text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight uppercase tracking-tight">
                  {currentArtifact.name}
                </h1>
              </div>

              {/* Dossier Information List */}
              <div className="space-y-1.5 text-stone-800 text-sm sm:text-base font-medium">
                {currentArtifact.period && (
                  <p className="leading-snug">
                    <span className="font-bold text-stone-900">• Niên đại:</span> {currentArtifact.period}
                  </p>
                )}
                {currentArtifact.location && (
                  <p className="leading-snug">
                    <span className="font-bold text-stone-900">• Địa điểm:</span> {currentArtifact.location}
                  </p>
                )}
                {currentArtifact.culture && (
                  <p className="leading-snug">
                    <span className="font-bold text-stone-900">• Văn hóa:</span> {currentArtifact.culture}
                  </p>
                )}
                {currentArtifact.material && (
                  <p className="leading-snug">
                    <span className="font-bold text-stone-900">• Chất liệu:</span> {currentArtifact.material}
                  </p>
                )}
                {currentArtifact.dimensions && (
                  <p className="leading-snug">
                    <span className="font-bold text-stone-900">• Kích thước:</span> {currentArtifact.dimensions}
                  </p>
                )}
              </div>

              {/* "Ý NGHĨA/ GIÁ TRỊ" Box with Red Border & Overlapping Decorative Cloud */}
              <div className="bg-white rounded-xl border-2 border-[#850B10] p-6 sm:p-7 relative shadow-sm">
                <h3 className="font-serif-royal font-bold text-[#850B10] text-base sm:text-lg mb-3 uppercase tracking-wider">
                  Ý NGHĨA/ GIÁ TRỊ
                </h3>

                <div className="text-stone-700 leading-relaxed text-sm sm:text-[15px] space-y-2.5 max-w-[92%]">
                  <p>{currentArtifact.significance || currentArtifact.description}</p>
                  {currentArtifact.significance && currentArtifact.description && currentArtifact.significance !== currentArtifact.description && (
                    <p className="text-stone-600 text-xs sm:text-sm pt-1">
                      {currentArtifact.description}
                    </p>
                  )}
                </div>

                {/* Crimson Cloud Motif overlapping bottom-right corner */}
                <div className="absolute -bottom-5 -right-5 sm:-bottom-6 sm:-right-6 pointer-events-none">
                  <RoyalRedCloudDecoration />
                </div>
              </div>

              {/* CTA Button: Ấn vào đây để tiếp tục khám phá → */}
              <div className="pt-2">
                <Link
                  to="/kho-tu-lieu"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#70070B] hover:from-[#850B10] hover:to-[#9E0D14] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 group"
                >
                  <span>Ấn vào đây để tiếp tục khám phá</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Editor Modal */}
        <Artifact3DEditorModal
          artifact={editorArtifact}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveArtifact}
          authToken={authToken}
        />
      </div>
    );
  }

  // ================= VIEWPORT MODE 3: 3D GALLERY GRID (design/image copy 15.png) =================
  return (
    <div
      className="w-full min-h-screen bg-[#FAF5EB] bg-repeat py-8 sm:py-12 px-4 sm:px-6 lg:px-10 relative overflow-hidden select-none"
      style={{ backgroundImage: "url('/home-assets/bg.png')" }}
    >
      {/* Decorative Traditional Golden Clouds in Background */}
      <img
        src="/home-assets/cloud_1.png"
        alt=""
        aria-hidden="true"
        className="absolute top-10 -left-20 w-80 sm:w-96 opacity-30 pointer-events-none select-none"
      />
      <img
        src="/home-assets/cloud_2.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-20 -right-24 w-80 sm:w-96 opacity-30 pointer-events-none select-none"
      />

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        {/* TOP ROYAL PLACARD BANNER (Traditional imperial board with notched stepped corners) */}
        <div className="relative mx-auto max-w-4xl">
          <div
            className="w-full bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#70070B] text-center py-6 sm:py-8 px-6 sm:px-12 shadow-2xl relative border-2 border-[#D4A359]/60"
            style={{
              clipPath:
                'polygon(0 14px, 14px 14px, 14px 0, calc(100% - 14px) 0, calc(100% - 14px) 14px, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 14px calc(100% - 14px), 0 calc(100% - 14px))'
            }}
          >
            {/* Inner Golden Hairline Border */}
            <div
              className="absolute inset-2 border border-[#FDE2A7]/50 pointer-events-none"
              style={{
                clipPath:
                  'polygon(0 10px, 10px 10px, 10px 0, calc(100% - 10px) 0, calc(100% - 10px) 10px, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 10px calc(100% - 10px), 0 calc(100% - 10px))'
              }}
            />

            <h1 className="font-serif-royal text-[#FDE2A7] text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-wider drop-shadow-md">
              STUDIO 3D TƯƠNG TÁC 360
            </h1>
            <p className="text-amber-100/90 text-xs sm:text-sm md:text-base font-normal mt-1 sm:mt-2 tracking-wide">
              Giới thiệu về không gian 3D
            </p>
          </div>

          {/* Quick Sub-navigation Actions (Admin & Maritime Route) */}
          <div className="flex items-center justify-end gap-2 mt-3">
            <Link
              to="/studio-3d/hai-trinh-bien"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-[#EBDBC5] text-stone-700 hover:text-[#850B10] text-xs font-bold transition shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Hải Trình Biển Đông</span>
            </Link>

            {isAdmin && (
              <button
                onClick={handleOpenNew}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#850B10] hover:bg-[#70070B] text-white text-xs font-bold transition shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-200" />
                <span>Thêm 3D</span>
              </button>
            )}
          </div>
        </div>

        {/* 6-COLUMN RESPONSIVE GRID (Matching design/image copy 15.png) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
          {allArtifacts.map((art) => (
            <div
              key={art.code}
              onClick={() => navigate(`/studio-3d/co-vat/${art.code}`)}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col border border-[#850B10]/15 hover:border-[#850B10]/40 group cursor-pointer overflow-hidden"
            >
              {/* Card Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-stone-100 flex items-center justify-center">
                {art.img ? (
                  <img
                    src={art.img}
                    alt={art.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}

                {/* Fallback Graphic if Image Fails or None */}
                <div
                  className={`w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center text-[#850B10] p-4 ${
                    art.img ? 'hidden' : 'flex'
                  }`}
                >
                  <Box className="w-10 h-10 text-[#850B10]/70 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-[#850B10]/80 mt-1 uppercase tracking-wider">
                    Mô hình 3D
                  </span>
                </div>

                {/* Subtle 3D Tag */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-[#850B10]/80 text-[#FDE2A7] text-[9px] font-black tracking-wider uppercase backdrop-blur-xs">
                  3D 360°
                </div>
              </div>

              {/* Card Metadata Row (Niên đại & Địa điểm) */}
              <div className="px-2.5 pt-2 pb-0.5 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#850B10] gap-1">
                <span className="truncate flex items-center gap-1" title={art.period}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#850B10] shrink-0" />
                  <span className="truncate">{art.period || 'Niên đại'}</span>
                </span>
                <span className="truncate flex items-center gap-1 text-right shrink-0" title={art.location}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#850B10] shrink-0" />
                  <span className="truncate max-w-[70px]">{art.location ? art.location.split('/')[0].trim() : 'Địa điểm'}</span>
                </span>
              </div>

              {/* Card Title (Uppercase Serif) */}
              <div className="px-2.5 pt-1 pb-2.5 flex-1 flex items-center justify-center">
                <h3 className="font-serif-royal font-bold text-center text-xs sm:text-sm text-[#70070B] group-hover:text-[#9E0D14] line-clamp-1 uppercase tracking-tight transition-colors">
                  {art.name}
                </h3>
              </div>

              {/* Scalloped Imperial Wave Bottom Border (matching design/image copy 15.png) */}
              <RoyalWaveBottom />
            </div>
          ))}
        </div>
      </div>

      {/* Admin Editor Modal */}
      <Artifact3DEditorModal
        artifact={editorArtifact}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveArtifact}
        authToken={authToken}
      />
    </div>
  );
}
