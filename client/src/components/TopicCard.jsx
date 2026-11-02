import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function TopicCard({ topic, onSelect }) {
  const url = `/kho-tu-lieu?topic=${topic.id}`;

  return (
    <Link
      to={url}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
    >
      {/* Image Preview with Topic Number */}
      <div className="relative h-36 overflow-hidden bg-slate-100">
        <img
          src={topic.img}
          alt={topic.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
        
        {/* Number Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-navy text-xs font-black px-2.5 py-1 rounded-lg shadow-sm border border-slate-100">
          Chủ đề {topic.id}
        </div>

        {/* Count Badge */}
        {topic.resource_count !== undefined && (
          <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-md text-gold text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
            <BookOpen className="w-3 h-3" />
            <span>{topic.resource_count} tư liệu</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800 group-hover:text-navy transition line-clamp-1">
            {topic.title}
          </h3>
          <p className="mt-1 text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {topic.description}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-navy group-hover:text-gold-dark transition">
          <span>Xem bài học & tư liệu</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
