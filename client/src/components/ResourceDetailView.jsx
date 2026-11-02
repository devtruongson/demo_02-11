import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Box, Image, Video, Calendar, MapPin, Eye, ExternalLink,
  Edit3, Trash2, Share2, Compass, Sparkles, BookOpen, Lightbulb,
  CheckCircle2, Layers, Maximize2, ChevronLeft, ChevronRight, Bookmark,
  Play, Film, Globe2, Clock
} from 'lucide-react';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';
import { parseIdFromSlug, createResourceSlug, formatYouTubeEmbedUrl } from '../utils/slugify.js';

export default function ResourceDetailView({
  resource: initialResource,
  allResources = [],
  currentUser,
  onEdit,
  onDelete
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(initialResource || null);
  const [loading, setLoading] = useState(!initialResource);
  const [error, setError] = useState(null);

  const [activeMediaTab, setActiveMediaTab] = useState('gallery'); // 'gallery' | 'video' | '3d'
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  // Fetch resource if navigated directly or after page refresh (F5)
  useEffect(() => {
    let resourceId = null;
    if (slug) {
      resourceId = parseIdFromSlug(slug);
    } else if (initialResource?.id) {
      resourceId = initialResource.id;
    }

    if (!resourceId) return;

    // Check if initialResource matches the requested ID
    if (initialResource && initialResource.id === resourceId) {
      setResource(initialResource);
      setDefaultMediaTab(initialResource);
      return;
    }

    // Otherwise, fetch from backend via Vite proxy
    setLoading(true);
    fetch(`/api/resources/${resourceId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tìm thấy tư liệu di tích yêu cầu');
        return res.json();
      })
      .then((data) => {
        setResource(data);
        setDefaultMediaTab(data);
        // Automatically increment view count
        fetch(`/api/resources/${resourceId}/view`, { method: 'POST' }).catch(() => {});
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, initialResource]);

  // Sync resource immediately when allResources is updated from parent (e.g. after edit/save)
  useEffect(() => {
    const resourceId = slug ? parseIdFromSlug(slug) : initialResource?.id;
    if (resourceId && allResources && allResources.length > 0) {
      const found = allResources.find((r) => r.id === resourceId);
      if (found) {
        setResource(found);
      }
    }
  }, [allResources, slug]);

  const setDefaultMediaTab = (data) => {
    if (data.model_3d) {
      setActiveMediaTab('gallery');
    } else if (data.video_url || data.type === 'video') {
      setActiveMediaTab('gallery');
    } else {
      setActiveMediaTab('gallery');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-slate-200/80 p-12">
        <div className="w-12 h-12 border-4 border-navy border-t-gold rounded-full animate-spin" />
        <span className="text-sm font-bold text-slate-600">Đang nạp hồ sơ di tích và tư liệu số...</span>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
        <h3 className="text-xl font-black text-slate-800">Không tìm thấy tư liệu</h3>
        <p className="text-sm text-slate-500">{error || 'Tư liệu có thể đã bị di chuyển hoặc xóa.'}</p>
        <button
          onClick={() => navigate('/kho-tu-lieu')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Kho Tư Liệu</span>
        </button>
      </div>
    );
  }

  // Extract gallery photos
  const rawGallery = resource.gallery;
  let galleryPhotos = [resource.img || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'];
  if (Array.isArray(rawGallery) && rawGallery.length > 0) {
    galleryPhotos = rawGallery;
  } else if (typeof rawGallery === 'string') {
    try {
      const normalized = rawGallery.replace(/'/g, '"');
      const parsed = JSON.parse(normalized);
      if (Array.isArray(parsed) && parsed.length > 0) galleryPhotos = parsed;
    } catch {
      if (rawGallery.includes('\n')) {
        galleryPhotos = rawGallery.split('\n').map(s => s.trim()).filter(Boolean);
      } else if (rawGallery.includes(',')) {
        galleryPhotos = rawGallery.split(',').map(s => s.trim().replace(/^['"\[\]]|['"\[\]]$/g, '')).filter(Boolean);
      } else if (rawGallery.startsWith('http')) {
        galleryPhotos = [rawGallery];
      }
    }
  }

  // YouTube Embed URL
  const youtubeEmbedUrl = formatYouTubeEmbedUrl(resource.video_url);

  // Related destinations / resources (same topic or region)
  const relatedResources = allResources
    .filter((r) => r.id !== resource.id && (r.topic_id === resource.topic_id || r.place === resource.place || r.lesson === resource.lesson))
    .slice(0, 4);

  // If not enough related by topic/place, take any other resources
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
    <div className="space-y-8 animate-fade-in pb-16">
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

          {/* Breadcrumbs with Real Links */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>/</span>
            <Link to="/kho-tu-lieu" className="hover:text-navy transition">
              Chủ đề {resource.topic_id}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold truncate max-w-[320px]">
              {resource.title}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200"
            title="Chia sẻ liên kết"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Đã sao chép liên kết!' : 'Chia sẻ'}</span>
          </button>

          {isAdmin && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(resource)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa tư liệu di tích này khỏi cơ sở dữ liệu?')) {
                      onDelete(resource.id);
                      navigate('/kho-tu-lieu');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Destination Hero: Gallery, YouTube 4K & 3D Interactive Showcase */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
        {/* Media Mode Switcher (Gallery vs Video YouTube vs 3D) */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg">
          <button
            onClick={() => setActiveMediaTab('gallery')}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition ${
              activeMediaTab === 'gallery'
                ? 'bg-white text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Image className="w-4 h-4 text-amber-500" />
            <span>Bộ Sưu Tập Ảnh ({galleryPhotos.length})</span>
          </button>

          {youtubeEmbedUrl && (
            <button
              onClick={() => setActiveMediaTab('video')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition ${
                activeMediaTab === 'video'
                  ? 'bg-rose-600 text-white shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-rose-300" />
              <span>Video Bài Học</span>
            </button>
          )}

          {resource.model_3d && (
            <button
              onClick={() => setActiveMediaTab('3d')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition ${
                activeMediaTab === '3d'
                  ? 'bg-gold text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4 text-slate-950" />
              <span>Studio 3D Xoay 360°</span>
            </button>
          )}
        </div>

        {/* Media Badge Indicator (Top Right) */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs font-bold">
          {activeMediaTab === 'gallery' && (
            <span>Ảnh {activePhotoIdx + 1} / {galleryPhotos.length}</span>
          )}
          {activeMediaTab === 'video' && (
            <span className="flex items-center gap-1.5 text-rose-400">
              <Play className="w-3 h-3 fill-rose-400" />
              <span>Video tư liệu học tập</span>
            </span>
          )}
          {activeMediaTab === '3d' && (
            <span className="flex items-center gap-1.5 text-gold">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Không gian 3D tương tác</span>
            </span>
          )}
        </div>

        {/* Visual Display Screen */}
        <div className="relative min-h-[460px] lg:min-h-[580px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
          {/* TAB 1: 3D MODEL */}
          {activeMediaTab === '3d' && resource.model_3d && (
            <div className="w-full h-full min-h-[580px]">
              <ThreeArtifactViewer
                modelCode={resource.model_3d}
                artifactInfo={{ name: resource.title }}
                height="580px"
                showControls={true}
              />
            </div>
          )}

          {/* TAB 2: YOUTUBE EMBED PLAYER (FULL BLEED CINEMA EXPANSION) */}
          {activeMediaTab === 'video' && youtubeEmbedUrl && (
            <div className="w-full aspect-video min-h-[460px] lg:min-h-[580px] max-h-[80vh] bg-black relative flex items-center justify-center">
              <iframe
                src={`${youtubeEmbedUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={resource.title}
                className="w-full h-full absolute inset-0 border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          {/* TAB 3: MULTI-PHOTO GALLERY */}
          {activeMediaTab === 'gallery' && (
            <div className="relative w-full h-[460px] lg:h-[580px] group flex items-center justify-center">
              <img
                src={galleryPhotos[activePhotoIdx]}
                alt={resource.title}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 pointer-events-none" />

              {/* Prev / Next Controls for Gallery */}
              {galleryPhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-md border border-white/20 active:scale-90"
                    title="Ảnh trước"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-md border border-white/20 active:scale-90"
                    title="Ảnh tiếp theo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Panoramic Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none max-w-4xl">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-gold/30 text-gold-light border border-gold/40 backdrop-blur-md mb-2 inline-block">
                  Hồ sơ tư liệu thực tế & Di tích lịch sử
                </span>
                <h3 className="text-xl sm:text-3xl font-black drop-shadow-md text-white leading-tight">
                  {resource.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 drop-shadow line-clamp-2 mt-1 font-medium">
                  {resource.lesson} • {resource.place} • Niên đại: {resource.period}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Filmstrip (Multiple Photos like a real Tourist Heritage Site) */}
        {activeMediaTab === 'gallery' && galleryPhotos.length > 1 && (
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-3 overflow-x-auto">
            {galleryPhotos.map((photoUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                  activePhotoIdx === idx
                    ? 'border-gold scale-105 shadow-md ring-2 ring-gold/40'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photoUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Destination Dossier & Quick Facts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Địa danh</span>
            <strong className="text-xs sm:text-sm text-slate-800 font-extrabold truncate block">
              {resource.place || 'Đông Nam Á'}
            </strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Niên đại</span>
            <strong className="text-xs sm:text-sm text-slate-800 font-extrabold truncate block">
              {resource.period || 'Cổ – trung đại'}
            </strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Lượt tham quan</span>
            <strong className="text-xs sm:text-sm text-slate-800 font-extrabold block">
              {(resource.view_count || 1).toLocaleString()} lượt
            </strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Định dạng</span>
            <strong className="text-xs sm:text-sm text-slate-800 font-extrabold capitalize truncate block">
              {resource.model_3d ? 'Hiện vật 3D + Ảnh' : (resource.type === 'video' ? 'Video tư liệu' : 'Bộ ảnh tư liệu')}
            </strong>
          </div>
        </div>
      </div>

      {/* Detailed Scholarly Narrative & Heritage Exploitation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Deep Historical Narrative (Multiple Chapters) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Description Box with Structured Formatting */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-navy-soft text-navy">
                Chuyên đề: {resource.lesson}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                Mã tư liệu: #{resource.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
              {resource.title}
            </h1>

            {/* Description Body: Split by sections if numbered, otherwise formatted paragraphs */}
            <div className="prose text-xs sm:text-sm text-slate-700 leading-relaxed font-normal pt-4 border-t border-slate-100 space-y-4">
              {resource.description ? (
                resource.description.split('\n\n').map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  // Check if paragraph starts with a numbered heading e.g. "1. Bối cảnh lịch sử:"
                  const matchHeading = trimmed.match(/^(\d+\.[\s\S]+?:)([\s\S]*)$/);
                  if (matchHeading) {
                    return (
                      <div key={pIdx} className="space-y-2 pt-2">
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2 text-navy">
                          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                          <span>{matchHeading[1]}</span>
                        </h4>
                        <p className="whitespace-pre-line leading-relaxed text-slate-700 pl-4 border-l-2 border-gold/30">
                          {matchHeading[2].trim()}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <p key={pIdx} className="whitespace-pre-line leading-relaxed text-slate-700">
                      {trimmed}
                    </p>
                  );
                })
              ) : (
                <p className="text-slate-500 italic">Đang cập nhật hồ sơ mô tả chi tiết...</p>
              )}
            </div>
          </div>

          {/* Dedicated YouTube Documentary Embed Section if not in hero tab */}
          {youtubeEmbedUrl && activeMediaTab !== 'video' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Film className="w-5 h-5 text-rose-600" />
                  <span>Thước Phim Tài Liệu & Góc Nhìn Thực Địa (YouTube 4K)</span>
                </h3>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  Phim tư liệu giáo khoa
                </span>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-black">
                <iframe
                  src={`${youtubeEmbedUrl}?rel=0&modestbranding=1`}
                  title={resource.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-slate-500 italic">
                * Video tư liệu được trích xuất từ các kênh khảo cổ và truyền hình giáo dục quốc tế phục vụ nghiên cứu và giảng dạy lịch sử.
              </p>
            </div>
          )}

          {/* Virtual Heritage Tour Guide / Cẩm Nang Khám Phá */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold-dark" />
              <span>Cẩm Nang Tham Quan & Nhận Diện Di Sản Số</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <strong className="text-slate-900 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Điểm nhấn quan sát:</span>
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Quan sát tỷ lệ kiến trúc, hoa văn điêu khắc đá sa thạch, các bức phù điêu miêu tả thần thoại và dấu ấn sinh hoạt cư dân cổ.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <strong className="text-slate-900 flex items-center gap-1.5 font-bold">
                  <Globe2 className="w-4 h-4 text-blue-500" />
                  <span>Giá trị tiếp biến văn hóa:</span>
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Dấu ấn dung hợp giữa văn minh thế giới với bản sắc bản địa Đông Nam Á, thể hiện sức sáng tạo độc lập của người xưa.
                </p>
              </div>
            </div>
          </div>

          {/* Pedagogical Exploitation Tip */}
          {resource.tip && (
            <div className="p-6 sm:p-7 rounded-3xl bg-amber-50/90 border border-amber-200/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Gợi Ý Khai Thác Sư Phạm (Dành Cho Giáo Viên & Học Sinh)</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed pl-7">
                {resource.tip}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Source References & Quick Meta */}
        <div className="lg:col-span-4 space-y-6">
          {/* Source Attribution Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
              Nguồn Tư Liệu & Thẩm Định
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block">Cơ quan lưu giữ / Nguồn ảnh:</span>
              <strong className="text-slate-900 block font-bold text-sm">
                {resource.source || 'Bảo tàng Lịch sử Quốc gia & UNESCO'}
              </strong>
            </div>

            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-navy hover:bg-navy-light text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm group"
              >
                <span>Xem tài liệu gốc tại nguồn</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Cập nhật gần nhất</span>
              </span>
              <span className="font-semibold text-slate-600">Tháng 11/2026</span>
            </div>
          </div>

          {/* Quick 3D Launcher if Available */}
          {resource.model_3d && activeMediaTab !== '3d' && (
            <div className="bg-gradient-to-br from-slate-900 to-navy text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-gold/20 text-gold border border-gold/30 inline-block">
                Không gian 3D tương tác
              </span>
              <h4 className="font-black text-sm text-white">
                Khám phá mô hình 3D thực tế ảo
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Xoay 360 độ, phóng to thu nhỏ bề mặt hiện vật và quan sát kỹ nghệ chế tác cổ đại.
              </p>
              <button
                onClick={() => {
                  setActiveMediaTab('3d');
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <Box className="w-4 h-4" />
                <span>Mở Studio 3D Xoay 360°</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RELATED POSTS SECTION (TƯ LIỆU & DI TÍCH LỊCH SỬ LIÊN QUAN)               */}
      {/* ========================================================================= */}
      {finalRelated.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-navy bg-navy-soft px-3 py-1 rounded-full inline-block mb-1.5">
                Khám phá mở rộng
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Tư Liệu & Di Tích Lịch Sử Liên Quan
              </h3>
            </div>
            <Link
              to="/kho-tu-lieu"
              className="text-xs font-bold text-navy hover:text-navy-light flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Xem toàn bộ 32+ tư liệu</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {finalRelated.map((item) => {
              const itemSlug = createResourceSlug(item.id, item.title);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(`/tu-lieu/${itemSlug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-gold/60 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Format Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {item.model_3d ? (
                        <span className="bg-gold text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Box className="w-3 h-3" />
                          <span>3D</span>
                        </span>
                      ) : (
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 capitalize">
                          {item.type}
                        </span>
                      )}
                    </div>

                    {/* View count */}
                    <div className="absolute bottom-2 right-2.5 text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gold" />
                      <span>{item.view_count || 1}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">
                        {item.place || 'Đông Nam Á'} • {item.period || 'Cổ đại'}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-navy line-clamp-2 leading-snug transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] truncate max-w-[130px]">
                        {item.lesson}
                      </span>
                      <span className="font-bold text-navy group-hover:text-gold-dark flex items-center gap-0.5 shrink-0 transition-colors">
                        <span>Chi tiết</span>
                        <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
