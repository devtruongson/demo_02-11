import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Sparkles, Compass, PlusCircle, Edit3, ArrowLeft,
  ArrowRight, MapPin, Calendar, Layers, ShieldCheck, ChevronRight
} from 'lucide-react';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';
import GlobeViewer3D from './GlobeViewer3D.jsx';
import Artifact3DEditorModal from './Artifact3DEditorModal.jsx';

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

  // Only display 3D artifacts returned by the API
  const allArtifacts = Array.isArray(artifacts3d) ? artifacts3d : [];

  // Active artifact for Detail view
  const currentArtifact = artifactCode
    ? allArtifacts.find((a) => a.code === artifactCode || String(a.id) === artifactCode) || null
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

  // ================= VIEWPORT MODE 2: ARTIFACT DETAIL VIEW =================
  if (artifactCode) {
    if (!currentArtifact) {
      return (
        <div
          className="w-full min-h-screen bg-[#FAF5EB] bg-repeat py-12 px-4 sm:px-6 lg:px-8 select-none flex items-center justify-center"
          style={{ backgroundImage: "url('/home-assets/bg.png')" }}
        >
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#EBDBC5] shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#850B10] flex items-center justify-center mx-auto text-xl font-black">
              !
            </div>
            <h3 className="font-bold text-base text-[#850B10]">Không tìm thấy bảo vật 3D</h3>
            <p className="text-xs text-stone-600">Bảo vật 3D này không tồn tại hoặc đã được gỡ khỏi hệ thống.</p>
            <Link
              to="/studio-3d"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#850B10] text-white text-xs font-bold hover:bg-[#70070B] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Không gian 3D</span>
            </Link>
          </div>
        </div>
      );
    }

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

        {/* 6-COLUMN RESPONSIVE GRID (Chỉ hiển thị các bảo vật 3D từ API) */}
        {allArtifacts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white/80 rounded-3xl border border-[#EBDBC5] p-8 max-w-md mx-auto shadow-2xs">
            <Box className="w-12 h-12 text-[#850B10]/40 mx-auto" />
            <p className="text-sm font-bold text-stone-700">Chưa có mô hình 3D nào trong hệ thống</p>
            <p className="text-xs text-stone-500">Các mô hình 3D được đồng bộ từ cơ sở dữ liệu sẽ hiển thị tại đây.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
            {allArtifacts.map((art) => (
              <div
                key={art.code || art.id}
                onClick={() => navigate(`/studio-3d/co-vat/${art.code || art.id}`)}
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
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.card-fallback-box');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback Graphic if Image Fails or None */}
                  <div
                    className={`card-fallback-box w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center text-[#850B10] p-4 ${
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
        )}
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
