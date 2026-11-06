import React, { useState } from 'react';
import { useParams, useNavigate, NavLink, Link } from 'react-router-dom';
import { Box, Sparkles, Compass, ShieldCheck, Layers, Info, CheckCircle2, Award, Edit3, PlusCircle, MapPin, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';
import GlobeViewer3D from './GlobeViewer3D.jsx';
import Artifact3DEditorModal from './Artifact3DEditorModal.jsx';

export default function Studio3DView({
  artifacts3d = [],
  currentUser = null,
  authToken = null,
  onArtifacts3DChange = null
}) {
  const { mode, artifactCode } = useParams();
  const navigate = useNavigate();

  const isGlobeMode = mode === 'hai-trinh-bien';
  const selectedCode = artifactCode || (artifacts3d[0]?.code || 'dong_son_drum');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorArtifact, setEditorArtifact] = useState(null);

  const isAdmin = currentUser?.role === 'admin';
  const currentArtifact = artifacts3d.find((a) => a.code === selectedCode) || artifacts3d[0];

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
    if (formData.code && formData.code !== selectedCode) {
      navigate(`/studio-3d/co-vat/${formData.code}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Studio 3D Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold text-slate-950">
              Công Nghệ Số Hóa 3D
            </span>
            <span className="text-xs text-amber-200/80 font-bold">• GDPT 2018 Lịch Sử 10</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Studio Bảo Vật 3D Tương Tác 360°
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Mô phỏng 3D xoay 360°, phóng to chi tiết hoa văn và hồ sơ khảo cổ học chuẩn bảo tàng quốc gia.
          </p>
        </div>

        {/* Studio Sub-modes Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <NavLink
              to={`/studio-3d/co-vat/${selectedCode}`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  !isGlobeMode ? 'bg-gold text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <Box className="w-4 h-4" />
              <span>Bảo Vật 3D ({artifacts3d.length})</span>
            </NavLink>

            <NavLink
              to="/studio-3d/hai-trinh-bien"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  isGlobeMode ? 'bg-gold text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <Compass className="w-4 h-4" />
              <span>Hải Trình Biển Đông</span>
            </NavLink>
          </div>

          {isAdmin && !isGlobeMode && (
            <button
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95 shrink-0"
              title="Thêm mô hình bảo vật 3D mới"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm 3D</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEWPORT MODE 1: GLOBE 3D SEA ROUTE */}
      {isGlobeMode ? (
        <div className="space-y-6">
          <GlobeViewer3D height="620px" />
        </div>
      ) : (
        /* VIEWPORT MODE 2: ARTIFACT 3D SPLIT-LAYOUT
           Feedback requirement: Bố cục 1 bên ảnh/3D (sticky giữ nguyên), 1 bên thông tin (kéo lên kéo xuống), bỏ phần câu hỏi về hiện vật */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT COLUMN: 3D VIEWER (STICKY - STAYS FIXED) ================= */}
          <div className="lg:col-span-7 lg:sticky lg:top-20 space-y-3 z-10">
            <div className="h-[460px] sm:h-[540px] lg:h-[calc(100vh-8.5rem)] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 relative">
              <ThreeArtifactViewer
                modelCode={currentArtifact?.embed || selectedCode}
                artifactInfo={currentArtifact}
                height="100%"
                showControls={true}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Nhấn giữ chuột trái để xoay 360° • Cuộn chuột để phóng to/thu nhỏ</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">WebGL 3D Engine</span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SCROLLABLE DOSSIER & ARTIFACT SELECTOR ================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* Artifact Quick Switcher Horizontal / Pill Carousel */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-navy" />
                  Danh sách bảo vật số hóa
                </span>
                <span className="text-xs text-slate-400 font-bold">{artifacts3d.length} hiện vật</span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {artifacts3d.map((art) => {
                  const isSelected = selectedCode === art.code;
                  return (
                    <NavLink
                      key={art.code}
                      to={`/studio-3d/co-vat/${art.code}`}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 border flex items-center gap-2 ${
                        isSelected
                          ? 'bg-navy text-white border-navy shadow-xs ring-2 ring-navy/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="truncate max-w-[140px]">{art.name}</span>
                      {art.embed && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Artifact Detailed Historical Dossier (Scrolls smoothly) */}
            {currentArtifact && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold/15 text-gold-dark border border-gold/30">
                      Bảo vật Quốc gia
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {currentArtifact.location}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {currentArtifact.period}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {currentArtifact.name}
                    </h2>
                    {isAdmin && (
                      <button
                        onClick={() => handleOpenEdit(currentArtifact)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gold" />
                        <span>Sửa 3D</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Archaeological Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">Văn hóa di sản:</span>
                    <strong className="text-navy font-bold">{currentArtifact.culture}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">Chất liệu đúc/tạc:</span>
                    <strong className="text-slate-800 font-bold">{currentArtifact.material}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2">
                    <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">Kích thước khảo cổ:</span>
                    <strong className="text-slate-800 font-bold">{currentArtifact.dimensions}</strong>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Đặc Điểm Khảo Cổ & Miêu Tả Hình Dáng
                  </h4>
                  <p className="font-normal">{currentArtifact.description}</p>
                </div>

                {/* Significance & Cultural Meaning */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm leading-relaxed text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Ý nghĩa lịch sử & biểu tượng văn hóa:</span>
                  </div>
                  <p className="font-normal text-amber-900/90 pl-5">
                    {currentArtifact.significance}
                  </p>
                </div>

                {/* Pedagogy Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Học liệu GDPT 2018 Lịch sử 10</span>
                  <Link
                    to="/kho-tu-lieu"
                    className="font-bold text-navy hover:text-amber-700 transition flex items-center gap-1"
                  >
                    <span>Khám phá kho tư liệu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin 3D Artifact Editor Modal */}
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
