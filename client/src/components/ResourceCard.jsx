import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Box, Video, FileText, Image, MapPin, Calendar, ExternalLink, Lightbulb } from 'lucide-react';
import { createResourceSlug } from '../utils/slugify.js';

export default function ResourceCard({ resource, onSelect, onOpen3D }) {
  const getTypeBadge = (type) => {
    switch (type) {
      case '3d':
        return { label: 'Mô hình 3D', icon: Box, color: 'bg-amber-500 text-slate-950 font-black' };
      case 'video':
        return { label: 'Video bài học', icon: Video, color: 'bg-rose-500 text-white' };
      case 'text':
        return { label: 'Văn bản / Bia ký', icon: FileText, color: 'bg-emerald-600 text-white' };
      default:
        return { label: 'Hình ảnh khảo cổ', icon: Image, color: 'bg-navy text-white' };
    }
  };

  const badge = getTypeBadge(resource.type);
  const BadgeIcon = badge.icon;
  const slug = createResourceSlug(resource.id, resource.title);
  const detailUrl = `/tu-lieu/${slug}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        {/* Thumbnail Preview Link */}
        <Link
          to={detailUrl}
          className="relative block h-48 overflow-hidden bg-slate-900 cursor-pointer"
        >
          <img
            src={resource.img}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-90" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm ${badge.color}`}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </span>
          </div>

          {/* Quick 3D button if model is available */}
          {resource.model_3d && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onOpen3D) onOpen3D(resource.model_3d, resource);
              }}
              title="Mở chế độ xoay 3D ngay"
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-gold text-white hover:text-slate-950 text-xs font-bold transition flex items-center gap-1 backdrop-blur-md border border-white/20"
            >
              <Box className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">Xem 3D</span>
            </button>
          )}

          {/* Lesson Tag on image bottom */}
          <div className="absolute bottom-2.5 left-3 right-3">
            <span className="text-[11px] font-bold text-slate-200 line-clamp-1 drop-shadow">
              {resource.lesson}
            </span>
          </div>
        </Link>

        {/* Card Info */}
        <div className="p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mb-1.5">
            {resource.period && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {resource.period}
              </span>
            )}
            {resource.place && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 line-clamp-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {resource.place}
                </span>
              </>
            )}
          </div>

          <Link
            to={detailUrl}
            className="font-extrabold text-sm text-slate-800 hover:text-navy cursor-pointer transition line-clamp-2 leading-snug block"
          >
            {resource.title}
          </Link>

          <p className="mt-2 text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {/* Pedagogical Tip preview */}
          {resource.tip && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 leading-normal flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                <strong>Gợi ý sư phạm:</strong> {resource.tip}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>{(resource.view_count || 1).toLocaleString()} lượt xem</span>
        </span>
        <Link
          to={detailUrl}
          className="flex items-center gap-1 font-bold text-navy hover:text-gold-dark transition"
        >
          <span>Khám phá</span>
        </Link>
      </div>
    </div>
  );
}
