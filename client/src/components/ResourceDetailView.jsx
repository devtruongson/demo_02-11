import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Box, Image, Video, Calendar, MapPin, Eye, ExternalLink,
  Edit3, Trash2, Share2, Compass, Sparkles, BookOpen, Lightbulb,
  CheckCircle2, Layers, Maximize2, ChevronLeft, ChevronRight, Bookmark,
  Play, Film, Globe2, Clock, FileText, Copy, Check, Printer, Target, GraduationCap, Award
} from 'lucide-react';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';
import QuizInteractiveComponent from './QuizInteractiveComponent.jsx';
import QuizEditorModal from './QuizEditorModal.jsx';
import { parseIdFromSlug, createResourceSlug, formatYouTubeEmbedUrl } from '../utils/slugify.js';

export default function ResourceDetailView({
  resource: initialResource,
  allResources = [],
  currentUser,
  authToken,
  onEdit,
  onDelete
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(initialResource || null);
  const [loading, setLoading] = useState(!initialResource);
  const [error, setError] = useState(null);

  // Quizzes for this resource / lesson
  const [resourceQuizzes, setResourceQuizzes] = useState([]);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const [activeMediaTab, setActiveMediaTab] = useState('gallery'); // 'gallery' | 'video' | '3d'
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const handleCopyCitation = () => {
    if (!resource) return;
    const citation = `Sử Ký Số (2026). "${resource.title}". Cổng học liệu số & Mô phỏng 3D Lịch sử 10 GDPT 2018. Truy xuất từ: ${window.location.href}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  useEffect(() => {
    let resourceId = null;
    if (slug) {
      resourceId = parseIdFromSlug(slug);
    } else if (initialResource?.id) {
      resourceId = initialResource.id;
    }

    if (!resourceId) return;

    if (initialResource && initialResource.id === resourceId) {
      setResource(initialResource);
      setDefaultMediaTab(initialResource);
      return;
    }

    setLoading(true);
    fetch(`/api/resources/${resourceId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tìm thấy tư liệu di tích yêu cầu');
        return res.json();
      })
      .then((data) => {
        setResource(data);
        setDefaultMediaTab(data);
        fetch(`/api/resources/${resourceId}/view`, { method: 'POST' }).catch(() => {});
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, initialResource]);

  useEffect(() => {
    const resourceId = slug ? parseIdFromSlug(slug) : initialResource?.id;
    if (resourceId && allResources && allResources.length > 0) {
      const found = allResources.find((r) => r.id === resourceId);
      if (found) {
        setResource(found);
      }
    }
  }, [allResources, slug]);

  const fetchQuizzes = async (resId) => {
    const targetId = resId || resource?.id;
    if (!targetId) return;
    try {
      const res = await fetch(`/api/quizzes?resource_id=${targetId}&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setResourceQuizzes(data);
      }
    } catch (err) {
      console.error('Lỗi khi nạp câu hỏi trắc nghiệm:', err);
    }
  };

  useEffect(() => {
    if (resource?.id) {
      fetchQuizzes(resource.id);
    }
  }, [resource?.id]);

  const setDefaultMediaTab = (res) => {
    if (res?.model_3d) {
      setActiveMediaTab('3d');
    } else if (res?.video_url) {
      setActiveMediaTab('video');
    } else {
      setActiveMediaTab('gallery');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-navy border-t-gold rounded-full animate-spin mx-auto" />
        <h3 className="font-extrabold text-lg text-slate-800">Đang phục hồi không gian di tích...</h3>
        <p className="text-xs text-slate-500">Đang đồng bộ dữ liệu số hóa và mô hình 3D khảo cổ</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-2xl font-black">
          !
        </div>
        <h3 className="font-extrabold text-xl text-slate-900">Không tìm thấy tư liệu học tập</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {error || 'Địa chỉ tư liệu này có thể đã bị di chuyển hoặc mã định danh không tồn tại trong hệ thống.'}
        </p>
        <button
          onClick={() => navigate('/kho-tu-lieu')}
          className="px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition shadow"
        >
          Trở lại kho tư liệu Lịch sử 10
        </button>
      </div>
    );
  }

  // Extract gallery photos
  const getGalleryPhotos = () => {
    const raw = resource.gallery;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (typeof raw === 'string') {
      try {
        const norm = raw.replace(/'/g, '"');
        const parsed = JSON.parse(norm);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length > 0) return lines;
      }
    }
    return resource.img ? [resource.img] : ['https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=80'];
  };

  const galleryPhotos = getGalleryPhotos();
  const youtubeEmbedUrl = formatYouTubeEmbedUrl(resource.video_url);

  const relatedResources = allResources
    .filter((r) => r.id !== resource.id && (r.topic_id === resource.topic_id || r.place === resource.place || r.lesson === resource.lesson))
    .slice(0, 4);

  const finalRelated = relatedResources.length >= 3
    ? relatedResources
    : [
        ...relatedResources,
        ...allResources.filter((r) => r.id !== resource.id && !relatedResources.some((item) => item.id === r.id))
      ].slice(0, 4);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % galleryPhotos.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/kho-tu-lieu')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-2xs group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại kho tư liệu</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>/</span>
            <Link to="/chu-de" className="hover:text-navy transition">
              Chủ đề {resource.topic_id}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold truncate max-w-[280px]">
              {resource.title}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-2xs"
            title="Chia sẻ liên kết"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
          </button>

          <button
            onClick={handleCopyCitation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-2xs"
            title="Trích dẫn khoa học chuẩn APA"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedCitation ? 'Đã sao chép trích dẫn!' : 'Trích dẫn'}</span>
          </button>

          {isAdmin && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(resource)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa tư liệu này?')) {
                      onDelete(resource.id);
                      navigate('/kho-tu-lieu');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAIN SPLIT-SCREEN LAYOUT:
          Feedback: Bố cục ảnh 1 bên (sticky giữ nguyên), thông tin 1 bên (kéo lên kéo xuống)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: STICKY MEDIA DISPLAY ================= */}
        <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-4 z-10">
          <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
            {/* Media Mode Switcher (Gallery vs Video vs 3D) */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg">
              <button
                onClick={() => setActiveMediaTab('gallery')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeMediaTab === 'gallery'
                    ? 'bg-white text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Image className="w-3.5 h-3.5 text-amber-500" />
                <span>Ảnh ({galleryPhotos.length})</span>
              </button>

              {youtubeEmbedUrl && (
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeMediaTab === 'video'
                      ? 'bg-rose-600 text-white shadow-md font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-rose-300" />
                  <span>Video</span>
                </button>
              )}

              {resource.model_3d && (
                <button
                  onClick={() => setActiveMediaTab('3d')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeMediaTab === '3d'
                      ? 'bg-gold text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-slate-950" />
                  <span>Mô hình 3D</span>
                </button>
              )}
            </div>

            {/* Media Screen Viewport */}
            <div className={`relative w-full overflow-hidden bg-slate-900 ${
              activeMediaTab === 'video' ? 'aspect-video' : 'h-[420px] sm:h-[480px] lg:h-[520px] flex items-center justify-center'
            }`}>
              {/* TAB 1: 3D MODEL */}
              {activeMediaTab === '3d' && resource.model_3d && (
                <div className="w-full h-full min-h-[460px]">
                  <ThreeArtifactViewer
                    modelCode={resource.model_3d}
                    artifactInfo={{ name: resource.title }}
                    height="100%"
                    showControls={true}
                  />
                </div>
              )}

              {/* TAB 2: YOUTUBE EMBED PLAYER */}
              {activeMediaTab === 'video' && youtubeEmbedUrl && (
                <iframe
                  src={`${youtubeEmbedUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title={resource.title}
                  className="w-full h-full border-0 aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}

              {/* TAB 3: GALLERY SLIDER */}
              {activeMediaTab === 'gallery' && (
                <div className="relative w-full h-full flex items-center justify-center group">
                  <img
                    src={galleryPhotos[activePhotoIdx]}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 pointer-events-none" />

                  {galleryPhotos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/20 active:scale-95"
                        title="Ảnh trước"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition border border-white/20 active:scale-95"
                        title="Ảnh sau"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gold/30 text-amber-200 border border-gold/40 mb-1 inline-block">
                      Ảnh {activePhotoIdx + 1} / {galleryPhotos.length}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-white truncate drop-shadow">
                      {resource.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Filmstrip */}
            {activeMediaTab === 'gallery' && galleryPhotos.length > 1 && (
              <div className="p-2.5 bg-slate-950/95 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                {galleryPhotos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-16 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === idx
                        ? 'border-gold scale-105 shadow-md ring-2 ring-gold/40'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photoUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Địa danh</span>
                <strong className="text-xs text-slate-800 font-extrabold truncate block">{resource.place || 'Đông Nam Á'}</strong>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Niên đại</span>
                <strong className="text-xs text-slate-800 font-extrabold truncate block">{resource.period || 'Cổ - trung đại'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: SCROLLABLE DOSSIER & PEDAGOGY ================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header Title & Curriculum Tag */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-navy/10 text-navy border border-navy/20">
                {resource.lesson || 'Chuyên đề GDPT 2018 Lịch sử 10'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                Chủ đề #{resource.topic_id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {resource.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {resource.description?.split('\n')[0] || 'Tư liệu học tập số hóa phục vụ giảng dạy và tự học môn Lịch sử 10.'}
            </p>
          </div>

          {/* Section: TƯ LIỆU ẢNH (Grid of all images with titles - Matching Feedback Diagram) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Image className="w-4 h-4 text-amber-600" />
                <span>Tư Liệu Ảnh & Hiện Vật Khảo Cổ</span>
              </h3>
              <span className="text-xs text-slate-400 font-bold">{galleryPhotos.length} ảnh độ nét cao</span>
            </div>

            {/* Grid of images with individual title - As drawn in feedback diagram */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryPhotos.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActivePhotoIdx(idx);
                    setActiveMediaTab('gallery');
                  }}
                  className={`group/img cursor-pointer rounded-2xl overflow-hidden border transition bg-slate-50 flex flex-col ${
                    activePhotoIdx === idx && activeMediaTab === 'gallery'
                      ? 'border-gold ring-2 ring-gold/40 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="relative h-24 overflow-hidden bg-slate-200">
                    <img
                      src={imgUrl}
                      alt={`${resource.title} - Ảnh ${idx + 1}`}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-black/60 text-white">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover/img:text-navy transition">
                      {idx === 0 ? resource.title : `Ảnh khảo sát tư liệu #${idx + 1}`}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {resource.place || 'Tư liệu số'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: TƯ LIỆU VIDEO (Matching Feedback Diagram) */}
          {youtubeEmbedUrl && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-600" />
                  <span>Tư Liệu Video & Thước Phim Lịch Sử</span>
                </h3>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full">
                  YouTube 4K
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-md border border-slate-200">
                <iframe
                  src={`${youtubeEmbedUrl}?rel=0&modestbranding=1`}
                  title={resource.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                Thước phim tài liệu trực quan giúp học sinh quan sát không gian bối cảnh thực địa của di tích.
              </p>
            </div>
          )}

          {/* Section: GỢI Ý TỔ CHỨC HỌC TẬP (Matching Feedback Diagram) */}
          <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/50 p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <h3 className="font-black text-sm sm:text-base text-amber-950 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-700" />
                <span>Gợi Ý Tổ Chức Hoạt Động Học Tập (Chuẩn 5512)</span>
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                Sư phạm 10
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-amber-950 leading-relaxed">
              <div className="p-3.5 bg-white/90 rounded-2xl border border-amber-200/70 space-y-1">
                <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wider text-amber-800">
                  1. Hoạt động Khởi động (5 phút):
                </strong>
                <p className="text-xs text-slate-700">
                  Cho học sinh quan sát ảnh hiện vật trên màn hình thông minh. Đặt câu hỏi: <em>"Dựa vào hình dáng và hoa văn, em có suy nghĩ gì về đời sống tinh thần của cư dân thời kỳ này?"</em>
                </p>
              </div>

              <div className="p-3.5 bg-white/90 rounded-2xl border border-amber-200/70 space-y-1">
                <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wider text-amber-800">
                  2. Hoạt động Khám phá & Bóc tách kiến thức:
                </strong>
                <p className="text-xs text-slate-700">
                  Học sinh làm việc theo nhóm 4 người, truy cập mô hình 3D tương tác để đo đạc và phát hiện các chi tiết khảo cổ học tiêu biểu.
                </p>
              </div>

              <div className="p-3.5 bg-white/90 rounded-2xl border border-amber-200/70 space-y-1">
                <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wider text-amber-800">
                  3. Luyện tập & Vận dụng:
                </strong>
                <p className="text-xs text-slate-700">
                  Hoàn thành 3 câu trắc nghiệm nhanh bên dưới để kiểm tra mức độ ghi nhớ và hiểu sâu về tư liệu.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Historical Narrative */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-navy" />
              <span>Hồ Sơ Lịch Sử & Phân Tích Chuyên Sâu</span>
            </h3>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              {resource.description ? (
                resource.description.split('\n\n').map((para, idx) => (
                  <p key={idx} className="whitespace-pre-line">{para.trim()}</p>
                ))
              ) : (
                <p className="text-slate-400 italic">Đang cập nhật hồ sơ chi tiết...</p>
              )}
            </div>
          </div>

          {/* Quizzes Component */}
          {resourceQuizzes.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Trắc Nghiệm Đánh Giá Nhanh</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">{resourceQuizzes.length} câu hỏi</span>
              </div>
              <QuizInteractiveComponent
                quizzes={resourceQuizzes}
                lessonTitle={resource.lesson || resource.title}
              />
            </div>
          )}

          {/* Related Resources */}
          {finalRelated.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 pb-2 border-b border-slate-100">
                Tư Liệu Cùng Chủ Đề
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {finalRelated.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/tu-lieu/${createResourceSlug(rel.title, rel.id)}`}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-20 rounded-xl overflow-hidden bg-slate-200 mb-2">
                        <img src={rel.img} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-navy line-clamp-1">{rel.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{rel.place || rel.lesson}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
