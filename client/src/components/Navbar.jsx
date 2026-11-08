import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass, BookOpen, Box, MessageSquare, GraduationCap, Users, Mail,
  ShieldCheck, User, LogOut, LayoutDashboard, ChevronDown, UserCheck, Menu, X, Info
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

  // Menu items according to design (Images 1, 7, 9)
  const navItems = [
    { to: '/chu-de', label: 'Chủ đề học tập' },
    { to: '/studio-3d', label: 'Không gian 3D' },
    { to: '/khong-gian-chung', label: 'Không gian học tập' },
    ...(isTeacher || isAdmin ? [{ to: '/giao-vien', label: 'Lớp học & Giao bài' }] : []),
    { to: '/lien-he', label: 'Liên hệ' },
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
    <header className="sticky top-0 z-50 bg-[#850B10] text-white select-none transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo Stamp (Matching design/image.png) */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer group shrink-0 outline-none focus:outline-none focus:ring-0"
            title="Sử Học Số - Trang chủ"
          >
            <img
              src="/home-assets/logo.png"
              alt="Logo Sử Học Số"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-md group-hover:scale-105 transition-transform outline-none focus:outline-none"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Link>

          {/* Navigation Items (Clean, White/Cream Sans-Serif) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-xs sm:text-sm font-semibold tracking-wide transition duration-150 py-1.5 ${
                    isActive
                      ? 'text-[#FDE2A7] font-bold border-b-2 border-[#FDE2A7]'
                      : 'text-white/90 hover:text-[#FDE2A7]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action: Auth & Profile */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Pill matching Image 9 */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-black/30 hover:bg-black/50 border border-amber-300/40 text-xs transition duration-150 cursor-pointer shadow-xs group"
                >
                  <div className="w-8 h-8 rounded-full border border-amber-200/60 bg-amber-500/20 flex items-center justify-center text-amber-200 shrink-0">
                    {isAdmin ? <ShieldCheck className="w-4 h-4 text-amber-300" /> : <User className="w-4 h-4 text-amber-200" />}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="font-extrabold text-xs text-white truncate max-w-[140px]">
                      {currentUser.full_name || currentUser.username}
                    </p>
                    <p className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                      {isAdmin ? 'QUẢN TRỊ VIÊN' : isTeacher ? 'GIÁO VIÊN' : 'HỌC SINH'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-200" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-amber-400/30 rounded-2xl shadow-2xl p-2 z-50 text-white animate-fadeIn"
                  >
                    <div className="p-3 border-b border-white/10">
                      <p className="font-bold text-xs text-white">{currentUser.full_name || currentUser.username}</p>
                      <p className="text-[10px] text-amber-200/80">@{currentUser.username}</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate('/dashboard');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition flex items-center gap-2 text-amber-300"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" /> Bảng Quản Trị
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition flex items-center gap-2"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-300" /> Cập nhật hồ sơ
                      </button>

                      <div className="my-1 border-t border-white/10" />

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/20 transition flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Đăng xuất tài khoản
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-md text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FFFDF8] hover:bg-white text-[#8B0B10] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>ĐĂNG NHẬP</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#73070b] border-t border-amber-300/20 p-4 space-y-3 animate-fadeIn">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-black/20"
            >
              {item.label}
            </NavLink>
          ))}
          {!currentUser && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-3 rounded-xl bg-[#FFF7E8] text-[#850b10] font-black text-xs uppercase tracking-wider text-center"
            >
              ĐĂNG NHẬP
            </button>
          )}
        </div>
      )}
    </header>
  );
}
