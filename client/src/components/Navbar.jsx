import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Landmark, Compass, BookOpen, GraduationCap, Users, Box,
  ShieldCheck, User, LogOut, LayoutDashboard, LogIn, ChevronDown, UserCheck
} from 'lucide-react';

export default function Navbar({
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenProfile
}) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';

  // Standard Navigation tabs (Dashboard is accessed from Profile dropdown as requested)
  const navItems = [
    { to: '/', label: 'Trang chủ', icon: Landmark, end: true },
    { to: '/chu-de', label: 'Chủ đề', icon: Compass },
    { to: '/kho-tu-lieu', label: 'Kho tư liệu', icon: BookOpen },
    { to: '/studio-3d', label: 'Studio 3D', icon: Box, badge: 'Mới' },
    { to: '/giao-vien', label: 'Giáo viên', icon: GraduationCap },
    { to: '/hoc-sinh', label: 'Học sinh', icon: Users },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Brand Logo with Link */}
          <Link
            to="/"
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-navy to-navy-light text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform duration-200 border border-white/20">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-navy">Sử Ký Số</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark border border-gold/30">
                  Lịch sử 10
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Kho học liệu số & Studio 3D GDPT 2018</p>
            </div>
          </Link>

          {/* Navigation Items with Real NavLink & Slugs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition duration-150 ${
                      isActive
                        ? 'bg-navy text-white shadow-sm'
                        : 'text-slate-600 hover:text-navy hover:bg-white/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black bg-gold text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action: Auth & Profile */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Pill Trigger Button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs transition duration-150 cursor-pointer shadow-2xs group"
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-white text-xs ${
                      isAdmin ? 'bg-amber-600' : isTeacher ? 'bg-blue-600' : 'bg-navy'
                    }`}
                  >
                    {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="font-extrabold text-slate-800 block leading-tight truncate max-w-[140px]">
                      {currentUser.full_name || currentUser.username}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      {isAdmin ? 'Quản trị viên' : isTeacher ? 'Giáo viên' : 'Học sinh'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-fade-in"
                  >
                    {/* User Identity Info Header */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 ${
                            isAdmin ? 'bg-amber-600' : isTeacher ? 'bg-blue-600' : 'bg-navy'
                          }`}
                        >
                          {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 truncate">
                            {currentUser.full_name || currentUser.username}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                            @{currentUser.username}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            isAdmin
                              ? 'bg-gold/20 text-slate-950 border border-gold/40'
                              : isTeacher
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isAdmin ? 'Tài khoản Quản trị viên' : isTeacher ? 'Tài khoản Giáo viên' : 'Tài khoản Học sinh'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="p-1.5 space-y-1">
                      {/* Option 1: Admin Dashboard (If admin) */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/dashboard');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-navy hover:bg-slate-50 transition text-left group cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-navy/10 text-navy group-hover:bg-navy group-hover:text-white flex items-center justify-center transition shrink-0">
                            <LayoutDashboard className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block leading-tight font-extrabold text-slate-900">
                              Bảng điều khiển quản trị
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal truncate block">
                              Quản trị tư liệu & phân tích
                            </span>
                          </div>
                        </button>
                      )}

                      {/* Option 2: Edit Profile (Modal) */}
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-navy hover:bg-slate-50 transition text-left group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gold/20 text-slate-950 group-hover:bg-gold flex items-center justify-center transition shrink-0">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block leading-tight font-extrabold text-slate-900">
                            Cập nhật hồ sơ
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal truncate block">
                            Đổi họ tên, email & mật khẩu
                          </span>
                        </div>
                      </button>

                      {/* Divider */}
                      <div className="my-1 border-t border-slate-100" />

                      {/* Option 3: Logout */}
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-extrabold">Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-navy hover:bg-navy-light text-white transition shadow-sm active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng Nhập</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
