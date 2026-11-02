import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, BookOpen, Box, GraduationCap, Users, Info, Lightbulb, LayoutDashboard } from 'lucide-react';

export default function Sidebar({ stats, currentUser }) {
  const isAdmin = currentUser?.role === 'admin';

  const menu = [
    { to: '/', label: 'Trang chủ', icon: Home, end: true },
    ...(isAdmin ? [{ to: '/dashboard', label: 'Dashboard Quản trị', icon: LayoutDashboard, badge: 'Admin' }] : []),
    { to: '/chu-de', label: 'Chủ đề học tập', icon: Compass },
    { to: '/kho-tu-lieu', label: 'Kho tư liệu', icon: BookOpen, count: stats?.resources },
    { to: '/studio-3d', label: 'Studio Hiện vật 3D', icon: Box, count: stats?.artifacts_3d, badge: '3D' },
    { to: '/giao-vien', label: 'Dành cho giáo viên', icon: GraduationCap },
    { to: '/hoc-sinh', label: 'Dành cho học sinh', icon: Users },
    { to: '/gioi-thieu', label: 'Giới thiệu dự án', icon: Info },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-white border border-slate-200/80 rounded-3xl p-4 flex-col justify-between shrink-0 min-h-[calc(100vh-120px)] shadow-xs">
      <div>
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 py-2">
          Không gian khám phá
        </div>
        <div className="space-y-1 mt-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-100/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gold text-slate-950">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Tip */}
      <div className="mt-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Mẹo sư phạm Lịch sử</span>
        </div>
        <p className="text-[11px] text-amber-950/80">
          Kết hợp quan sát ảnh hiện vật, lược đồ địa lý và mô hình 3D xoay 360° để giúp học sinh tự phát hiện tri thức thay vì truyền thụ một chiều.
        </p>
      </div>
    </aside>
  );
}
