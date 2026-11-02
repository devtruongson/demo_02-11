import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Mail, Lock, Eye, EyeOff, X, CheckCircle2, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  authToken,
  onProfileUpdated
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setEmail(currentUser.email || '');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setMessage({ type: '', text: '' });
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const isTeacher = currentUser.role === 'teacher';

  const roleLabel = isAdmin ? 'Quản trị viên' : isTeacher ? 'Giáo viên' : 'Học sinh';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập họ và tên của bạn.' });
      return;
    }

    if (password) {
      if (password.length < 6) {
        setMessage({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu từ 6 ký tự.' });
        return;
      }
      if (password !== confirmPassword) {
        setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim()
      };
      if (password) {
        payload.password = password;
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật hồ sơ cá nhân');
      }

      setMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
      if (onProfileUpdated) {
        onProfileUpdated(data.user, data.token);
      }

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
                isAdmin ? 'bg-amber-600' : isTeacher ? 'bg-blue-600' : 'bg-navy'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Cập Nhật Hồ Sơ Cá Nhân
              </h3>
              <p className="text-xs text-slate-500">
                Chỉnh sửa họ tên, email và thiết lập mật khẩu bảo vệ mới.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identity Pill Card */}
        <div className="px-6 pt-5 pb-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Tài khoản đăng nhập
              </span>
              <strong className="font-mono text-slate-900 text-sm">
                @{currentUser.username}
              </strong>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                isAdmin
                  ? 'bg-gold/25 text-slate-950 border border-gold/50'
                  : isTeacher
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {message.text && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border border-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Họ và tên người dùng *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Thầy Nguyễn Văn An"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Địa chỉ Email liên hệ
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@sukyso.edu.vn"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
              />
            </div>
          </div>

          {/* Change Password Group */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-gold-dark" />
                <span>Đổi mật khẩu mới</span>
              </label>
              <span className="text-[10px] text-slate-400">Tùy chọn</span>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Để trống nếu giữ nguyên mật khẩu cũ..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 text-xs font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password && (
              <div className="relative animate-fade-in">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới để xác nhận..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy bg-white shadow-2xs"
                />
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Chỉ nhập khi bạn muốn thiết lập mật khẩu đăng nhập mới (tối thiểu 6 ký tự).
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-black transition shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                  <span>Lưu Hồ Sơ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

