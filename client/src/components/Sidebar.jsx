import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Compass, BookOpen, Box, GraduationCap, Users, Info, Lightbulb,
  LayoutDashboard, Mail, ChevronLeft, ChevronRight, MessageSquare, Flame
} from 'lucide-react';

export default function Sidebar({
  stats,
  currentUser,
  isCollapsed = false,
  onToggleCollapse
}) {
  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  const menu = [
    { to: '/', label: 'Trang chủ', icon: Home, end: true },
    ...(isAdmin ? [{ to: '/dashboard', label: 'Dashboard Quản trị', icon: LayoutDashboard, badge: 'Admin' }] : []),
    { to: '/chu-de', label: 'Chủ đề học tập', icon: Compass, count: stats?.topics || 7 },
    { to: '/kho-tu-lieu', label: 'Kho tư liệu', icon: BookOpen, count: stats?.resources },
    { to: '/studio-3d', label: 'Studio Hiện vật 3D', icon: Box, count: stats?.artifacts_3d, badge: '3D' },
    { to: '/khong-gian-chung', label: 'Không gian học tập', icon: MessageSquare, badge: 'Mới' },
    ...(isTeacher || isAdmin ? [{ to: '/giao-vien', label: 'Dành cho giáo viên', icon: GraduationCap, badge: 'Lớp' }] : []),
    ...(isStudent ? [{ to: '/hoc-sinh', label: 'Góc học tập của em', icon: Users, badge: `🔥 ${currentUser?.streak_count || 1}d` }] : []),
    { to: '/lien-he', label: 'Liên hệ & Góp ý', icon: Mail },
    { to: '/gioi-thieu', label: 'Giới thiệu dự án', icon: Info },
  ];

  return (
    <aside
      className={`hidden lg:flex bg-white border border-slate-200/80 rounded-3xl p-3 sm:p-4 flex-col justify-between shrink-0 shadow-xs transition-all duration-300 min-h-[calc(100vh-120px)] ${
        isCollapsed ? 'w-18 items-center' : 'w-64'
      }`}
    >
      <div className="w-full">
        {/* Header & Toggle Button */}
        <div className={`flex items-center pb-3 mb-2 border-b border-slate-100 ${
          isCollapsed ? 'justify-center' : 'justify-between px-2'
        }`}>
          {!isCollapsed && (
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Khám phá hệ thống
            </span>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            title={isCollapsed ? 'Mở rộng thanh công cụ (Đẩy hình ảnh sang phải)' : 'Thụt vào (Phóng to hình ảnh toàn màn hình)'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-700" />
            ) : (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900">
                <span>Thu gọn</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        </div>

        {/* Menu Items */}
        <div className="space-y-1 mt-1 w-full">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center rounded-2xl text-xs font-semibold transition group relative ${
                    isCollapsed
                      ? 'justify-center p-3'
                      : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
                title={isCollapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isActive ? 'bg-white/20 text-white' : 'bg-gold/20 text-slate-900'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tooltip on hover when collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                        {item.label}
                        {item.count !== undefined && ` (${item.count})`}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Student Streak Badge in Sidebar if logged in */}
      {isStudent && currentUser && !isCollapsed && (
        <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-900">
          <div className="flex items-center gap-2 font-black text-xs text-amber-800 mb-0.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>Chuỗi Streak: {currentUser.streak_count || 1} ngày!</span>
          </div>
          <p className="text-[10px] text-amber-700/80 leading-tight">
            Đăng nhập học bài mỗi ngày để tích lũy chuỗi và thăng hạng trên Bảng Vàng!
          </p>
        </div>
      )}

      {/* Pedagogical Tip - Hidden when collapsed */}
      {!isCollapsed && (
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-slate-600" />
            <span>Gợi ý sư phạm</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Kết hợp quan sát ảnh hiện vật, lược đồ địa lý và mô hình 3D xoay 360° để giúp học sinh tự phát hiện tri thức lịch sử.
          </p>
        </div>
      )}
    </aside>
  );
}
