import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Lock, User, ArrowRight, AlertCircle, CheckCircle2,
  GraduationCap, Sparkles, Landmark, ArrowLeft, ShieldCheck, Flame, BookOpen
} from 'lucide-react';

export default function AuthPage({ currentUser, onLoginSuccess }) {
  const { roleParam } = useParams(); // 'hoc-sinh' or 'giao-vien'
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'teacher') navigate('/giao-vien');
      else if (currentUser.role === 'student') navigate('/hoc-sinh');
      else navigate('/');
    }
  }, [currentUser, navigate]);

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const role = roleParam === 'giao-vien' ? 'teacher' : 'student';
  const isTeacher = role === 'teacher';

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
      if (data.user?.role === 'teacher') {
        navigate('/giao-vien');
      } else if (data.user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/hoc-sinh');
      }
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

      setSuccessMsg(`Đăng ký tài khoản ${isTeacher ? 'Giáo viên' : 'Học sinh'} thành công! Đang chuyển hướng...`);
      setTimeout(() => {
        onLoginSuccess(data.user, data.token);
        if (role === 'teacher') navigate('/giao-vien');
        else navigate('/hoc-sinh');
      }, 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
        {/* Top Back Link */}
        <div className="bg-slate-900 text-slate-300 px-6 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-white transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Trang chủ</span>
          </Link>
          <span className="font-mono text-[11px] text-amber-300/80">Sử Ký Số GDPT 2018</span>
        </div>

        {/* Dedicated Banner Header */}
        <div className={`px-6 sm:px-8 py-7 text-white transition-colors duration-300 ${
          isTeacher
            ? 'bg-gradient-to-br from-slate-950 via-stone-900 to-amber-950 border-b border-amber-900/40'
            : 'bg-gradient-to-br from-slate-950 via-navy to-navy-light border-b border-navy-light/40'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
              isTeacher
                ? 'bg-amber-400 text-slate-950'
                : 'bg-gold text-slate-950'
            }`}>
              {isTeacher ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>CỔNG GIÁO VIÊN</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>CỔNG HỌC SINH</span>
                </>
              )}
            </span>
            <span className="text-xs text-amber-200/90 font-medium">
              {isTeacher ? 'Kế hoạch dạy học 5512' : 'Tự học Lịch Sử 10'}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight leading-snug">
            {tab === 'login'
              ? (isTeacher ? 'Đăng Nhập Cổng Giáo Viên' : 'Đăng Nhập Góc Học Tập')
              : (isTeacher ? 'Đăng Ký Tài Khoản Giáo Viên' : 'Đăng Ký Tài Khoản Học Sinh')}
          </h2>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {isTeacher
              ? 'Tổ chức lớp học số, giao bài tập trắc nghiệm, theo dõi tiến độ & khai thác bài giảng 5512.'
              : 'Nhận nhiệm vụ học tập từ thầy cô, luyện đề trắc nghiệm và duy trì chuỗi Streak mỗi ngày 🔥'}
          </p>
        </div>

        {/* Tabs: Login vs Register */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-3.5 text-xs font-bold transition text-center border-b-2 cursor-pointer ${
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
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-3.5 text-xs font-bold transition text-center border-b-2 cursor-pointer ${
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
        <div className="p-6 sm:p-7 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4">
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
            <form onSubmit={handleRegister} className="space-y-3.5">
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
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/90 -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 py-4 rounded-b-3xl">
            {isTeacher ? (
              <>
                <span>Em là học sinh tham gia học tập?</span>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/dang-nhap/hoc-sinh');
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
                    navigate('/dang-nhap/giao-vien');
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

