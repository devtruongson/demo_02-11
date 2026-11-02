import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Landmark, Compass, BookOpen, GraduationCap, Users, Box,
  ShieldCheck, User, LogOut, LayoutDashboard, LogIn, ChevronDown, UserCheck,
  Menu, X, Info, Sparkles
} from 'lucide-react';

export default function Navbar({
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenProfile
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo with Link */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0 min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-navy to-navy-light text-white flex items-center justify-center text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform duration-200 border border-white/20 shrink-0">
              🏛️
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-navy">Sử Ký Số</span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark border border-gold/30 shrink-0">
                  Lịch sử 10
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-medium text-slate-400 truncate">
                Kho học liệu số & Studio 3D GDPT 2018
              </p>
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
              <button
                onClick={onOpenLogin}
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-navy hover:bg-navy-light text-white transition shadow-sm active:scale-95 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer shrink-0"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer via React Portal directly into document.body */}
      {typeof document !== 'undefined' && createPortal(
        <div
          className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${
            mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div
            className={`fixed top-0 left-0 bottom-0 w-[290px] max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between z-10 p-5 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="space-y-5">
              {/* Drawer Header with Logo & Close */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center text-lg shadow-sm">
                    🏛️
                  </div>
                  <div>
                    <span className="font-black text-base text-navy block">Sử Ký Số</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Lịch sử 10 GDPT 2018</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-2">
                  Danh mục khám phá
                </span>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? 'bg-navy text-white shadow-sm'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-slate-400'}`} />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gold text-slate-950">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}

                  <NavLink
                    to="/gioi-thieu"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-navy text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Info className="w-4 h-4 text-slate-400" />
                      <span>Giới thiệu dự án</span>
                    </div>
                  </NavLink>

                  {isAdmin && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                          isActive
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Bảng Quản Trị</span>
                      </div>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                        Admin
                      </span>
                    </NavLink>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-4 border-t border-slate-100">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900 truncate">
                        {currentUser.full_name || currentUser.username}
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        {isAdmin ? 'Quản trị viên' : isTeacher ? 'Giáo viên' : 'Học sinh'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                      title="Đăng xuất"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-2.5 rounded-xl bg-navy text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                >
                  <LogIn className="w-4 h-4 text-gold" />
                  <span>Đăng Nhập Tài Khoản</span>
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
