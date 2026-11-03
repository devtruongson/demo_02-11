import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Edit3, Trash2 } from 'lucide-react';

export default function TopicCard({ topic, onSelect, isAdmin = false, onEdit = null, onDelete = null }) {
  const url = `/kho-tu-lieu?topic=${topic.id}`;
  const fallbackImg = 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Image Preview with Topic Number */}
      <Link to={url} className="relative h-36 overflow-hidden bg-slate-100 block">
        <img
          src={topic.img || fallbackImg}
          alt={topic.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
        
        {/* Number Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-navy text-xs font-black px-2.5 py-1 rounded-lg shadow-sm border border-slate-100">
          Chủ đề {topic.order_index || topic.id}
        </div>

        {/* Count Badge */}
        {topic.resource_count !== undefined && (
          <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-md text-gold text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
            <BookOpen className="w-3 h-3" />
            <span>{topic.resource_count} tư liệu</span>
          </div>
        )}
      </Link>

      {/* Admin Quick Action Controls */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(topic);
              }}
              className="p-1.5 rounded-lg bg-gold/20 hover:bg-gold text-amber-300 hover:text-slate-950 transition cursor-pointer"
              title="Đổi tên & chỉnh sửa chủ đề"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(topic);
              }}
              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white transition cursor-pointer"
              title="Xóa chủ đề này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <Link to={url} className="block group-hover:text-navy">
          <h3 className="font-extrabold text-sm text-slate-800 group-hover:text-navy transition line-clamp-1">
            {topic.title}
          </h3>
          <p className="mt-1 text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {topic.description}
          </p>
        </Link>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-navy group-hover:text-gold-dark transition">
          <Link to={url} className="flex-1 flex items-center justify-between">
            <span>Xem bài học & tư liệu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
