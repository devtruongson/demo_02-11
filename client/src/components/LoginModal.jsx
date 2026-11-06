import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, GraduationCap, Sparkles, Flame, BookOpen } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, initialRole = 'student' }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState(initialRole || 'student'); // 'student' | 'teacher'

  // Sync role if initialRole changes when opening
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole, isOpen]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginIdentifier,
          password: loginPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng nhập không thành công');
      }

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: regFullName,
          username: regUsername,
          email: regEmail,
          password: regPassword,
          role: role
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Đăng ký không thành công');
      }

      setSuccessMsg(`Đăng ký tài khoản ${role === 'teacher' ? 'Giáo viên' : 'Học sinh'} thành công! Đang tự động đăng nhập...`);
      setTimeout(() => {
        onLoginSuccess(data.user, data.token);
        onClose();
      }, 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = role === 'teacher';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 my-8 transition-all duration-300"
      >
        {/* ======================================================== */}
        {/* DEDICATED HEADER: STUDENT VS TEACHER BRANDING            */}
        {/* ======================================================== */}
        <div className={`px-6 py-6 text-white flex items-center justify-between transition-colors duration-300 ${
          isTeacher
            ? 'bg-gradient-to-r from-slate-900 via-stone-900 to-amber-950 border-b border-amber-900/30'
            : 'bg-gradient-to-r from-navy via-navy-light to-navy border-b border-navy-light/30'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                isTeacher
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-gold text-slate-950'
              }`}>
                {isTeacher ? (
                  <>
                    <GraduationCap className="w-3 h-3" />
                    <span>Cổng Giáo Viên</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3" />
                    <span>Cổng Học Sinh</span>
                  </>
                )}
              </span>

              <span className="text-[11px] text-amber-200/90 font-medium">
                {isTeacher ? 'Kế hoạch 5512 & Lớp học' : 'Lịch Sử 10 • GDPT 2018'}
              </span>
            </div>

            <h3 className="font-extrabold text-xl leading-tight">
              {tab === 'login'
                ? (isTeacher ? 'Đăng Nhập Cổng Giáo Viên' : 'Đăng Nhập Góc Học Tập')
                : (isTeacher ? 'Đăng Ký Tài Khoản Giáo Viên' : 'Đăng Ký Tài Khoản Học Sinh')}
            </h3>

            <p className="text-xs text-slate-300 mt-1">
              {isTeacher
                ? 'Tổ chức lớp học, giao bài tập, chấm điểm & khai thác bài giảng'
                : 'Làm nhiệm vụ học tập, luyện thi trắc nghiệm & tích lũy Streak 🔥'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0 self-start mt-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Đăng Nhập vs Đăng Ký */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition text-center border-b-2 cursor-pointer ${
              tab === 'login'
                ? isTeacher
                  ? 'border-amber-700 text-amber-900 bg-white shadow-xs font-black'
                  : 'border-navy text-navy bg-white shadow-xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition text-center border-b-2 cursor-pointer ${
              tab === 'register'
                ? isTeacher
                  ? 'border-amber-700 text-amber-900 bg-white shadow-xs font-black'
                  : 'border-navy text-navy bg-white shadow-xs font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Ký Mới
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập hoặc Email {isTeacher ? 'giáo viên' : 'học sinh'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={isTeacher ? 'giaovien hoặc email trường...' : 'Tên tài khoản hoặc email học sinh...'}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 ${
                      isTeacher ? 'focus:ring-amber-600' : 'focus:ring-navy'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 ${
                      isTeacher ? 'focus:ring-amber-600' : 'focus:ring-navy'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer ${
                  isTeacher
                    ? 'bg-amber-700 hover:bg-amber-800'
                    : 'bg-navy hover:bg-navy-light'
                }`}
              >
                <span>{loading ? 'Đang xác thực bảo mật...' : `Đăng Nhập Cổng ${isTeacher ? 'Giáo Viên' : 'Học Sinh'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên {isTeacher ? 'thầy / cô giáo' : 'học sinh'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder={isTeacher ? 'Ví dụ: Thầy Trần Quang Khải' : 'Ví dụ: Nguyễn Văn Nam'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 ${
                    isTeacher ? 'focus:ring-amber-600' : 'focus:ring-navy'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder={isTeacher ? 'Ví dụ: thaykhai_su hoặc gv_lichsu' : 'Ví dụ: nam_lop10a1'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 ${
                    isTeacher ? 'focus:ring-amber-600' : 'focus:ring-navy'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder={isTeacher ? 'thaykhai@thpt.edu.vn' : 'hocsinh@gmail.com'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 ${
                    isTeacher ? 'focus:ring-amber-600' : 'focus:ring-navy'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu (Tối thiểu 6 ký tự) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 ${
                    isTeacher ? 'focus:ring-amber-600' : 'focus:ring-navy'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-slate-950 text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer ${
                  isTeacher
                    ? 'bg-amber-400 hover:bg-amber-500'
                    : 'bg-gold hover:bg-gold-dark'
                }`}
              >
                <span>{loading ? 'Đang khởi tạo tài khoản...' : `Tạo Tài Khoản ${isTeacher ? 'Giáo Viên' : 'Học Sinh'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* BOTTOM SWITCH LINK: TIẾP TỤC VỚI GIÁO VIÊN / HỌC SINH     */}
          {/* ======================================================== */}
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/90 -mx-6 -mb-6 px-6 py-3.5 rounded-b-3xl">
            {isTeacher ? (
              <>
                <span>Em là học sinh tham gia học tập?</span>
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="font-extrabold text-navy hover:text-gold-dark flex items-center gap-1 cursor-pointer transition hover:underline"
                >
                  <span>Tiếp tục với vai trò Học sinh</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <span>Thầy cô muốn vào cổng giảng dạy?</span>
                <button
                  type="button"
                  onClick={() => {
                    setRole('teacher');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="font-extrabold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer transition hover:underline"
                >
                  <span>Tiếp tục với vai trò Giáo viên</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
