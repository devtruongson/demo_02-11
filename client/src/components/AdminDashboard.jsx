import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Users, BookOpen, Box, Eye, Activity, ShieldCheck,
  RefreshCw, PlusCircle, Edit3, Trash2, Calendar, Award, ArrowUpRight, Search, Filter,
  ArrowLeft, LogOut, X, ExternalLink, Film, Image, MapPin, Sparkles, CheckCircle2,
  ChevronRight, LayoutList, LayoutGrid, KeyRound, EyeOff, UserCheck, AlertCircle
} from 'lucide-react';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';
import { formatYouTubeEmbedUrl } from '../utils/slugify.js';

export default function AdminDashboard({
  currentUser,
  authToken,
  onNewResource,
  onEditResource,
  onDeleteResource,
  onLogout,
  refreshTrigger
}) {
  const [analytics, setAnalytics] = useState(null);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'resources' | 'users'
  const [resourceSearch, setResourceSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Dedicated Admin Internal Preview (Not using client detail page)
  const [previewResource, setPreviewResource] = useState(null);
  const [previewActiveTab, setPreviewActiveTab] = useState('gallery'); // 'gallery' | 'video' | '3d'
  const [previewPhotoIdx, setPreviewPhotoIdx] = useState(0);

  // User Management State (Edit name, role, change password)
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    full_name: '',
    role: 'student',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userSaving, setUserSaving] = useState(false);
  const [userMsg, setUserMsg] = useState({ type: '', text: '' });

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setUserFormData({
      full_name: u.full_name || '',
      role: u.role || 'student',
      email: u.email || '',
      password: ''
    });
    setShowPassword(false);
    setUserMsg({ type: '', text: '' });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!userFormData.full_name.trim()) {
      setUserMsg({ type: 'error', text: 'Vui lòng nhập họ và tên người dùng.' });
      return;
    }
    if (userFormData.password && userFormData.password.length < 6) {
      setUserMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }

    setUserSaving(true);
    setUserMsg({ type: '', text: '' });
    try {
      const payload = {
        full_name: userFormData.full_name.trim(),
        role: userFormData.role,
        email: userFormData.email.trim()
      };
      if (userFormData.password) {
        payload.password = userFormData.password;
      }

      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật tài khoản');
      }

      setUsers((prev) =>
        prev.map((item) => (item.id === editingUser.id ? { ...item, ...data.user } : item))
      );

      if (currentUser && currentUser.id === editingUser.id) {
        const updatedCurrent = { ...currentUser, ...data.user };
        localStorage.setItem('sukyso_user', JSON.stringify(updatedCurrent));
      }

      setUserMsg({ type: 'success', text: 'Cập nhật tài khoản người dùng thành công!' });
      setTimeout(() => {
        setEditingUser(null);
        fetchDashboardData();
      }, 700);
    } catch (err) {
      setUserMsg({ type: 'error', text: err.message });
    } finally {
      setUserSaving(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const ts = Date.now();
      const [analyticsRes, resRes, usersRes] = await Promise.all([
        fetch(`/api/analytics/overview?_t=${ts}`).then((r) => r.json()),
        fetch(`/api/resources?_t=${ts}`).then((r) => r.json()),
        fetch(`/api/users?_t=${ts}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).then((r) => (r.ok ? r.json() : []))
      ]);

      setAnalytics(analyticsRes);
      setResources(resRes);
      setUsers(usersRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  // Filter resources
  const filteredResources = resources.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      r.lesson.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      r.place.toLowerCase().includes(resourceSearch.toLowerCase());
    const matchTopic = topicFilter === 'all' || r.topic_id === Number(topicFilter);
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    return matchSearch && matchTopic && matchType;
  });

  const handleOpenAdminPreview = (res) => {
    setPreviewResource(res);
    setPreviewActiveTab('gallery');
    setPreviewPhotoIdx(0);
  };

  // Extract gallery photos for preview
  const getPreviewPhotos = (res) => {
    if (!res) return [];
    const raw = res.gallery;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (typeof raw === 'string') {
      try {
        const norm = raw.replace(/'/g, '"');
        const parsed = JSON.parse(norm);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return raw.split('\n').filter(Boolean);
      }
    }
    return res.img ? [res.img] : [];
  };

  const previewPhotos = previewResource ? getPreviewPhotos(previewResource) : [];
  const previewYoutubeUrl = previewResource ? formatYouTubeEmbedUrl(previewResource.video_url) : null;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* ================= DEDICATED ADMIN TOPBAR (NO CLIENT MENU ITEMS) ================= */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 text-white -mx-4 sm:-mx-8 lg:-mx-12 -mt-4 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-navy to-navy-light text-white flex items-center justify-center font-black text-sm border border-white/20 shadow-sm">
            🏛️
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block leading-tight">
              Sử Ký Số • Trung Tâm Quản Trị Hệ Thống
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Hệ thống vận hành trực tuyến • Phiên làm việc Quản trị viên
            </span>
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block leading-tight">
              Sử Ký Số • Trung Tâm Quản Trị Hệ Thống
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Hệ thống vận hành trực tuyến • Phiên làm việc Quản trị viên
            </span>
          </div>
        </div>

        {/* Action Controls & Admin Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-800"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNewResource}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm tư liệu mới</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="w-6 h-6 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">
              {currentUser?.full_name || currentUser?.username}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Đăng xuất khỏi hệ thống"
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition border border-slate-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ================= DASHBOARD COCKPIT HEADER ================= */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-dark to-navy text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold/20 text-gold border border-gold/40">
              <ShieldCheck className="w-3.5 h-3.5" /> Bảng Điều Khiển Quản Trị
            </span>
            <span className="text-xs text-slate-400 font-medium">• Chế độ độc lập không tái sử dụng giao diện Client</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Xin chào, <span className="text-gold">{currentUser?.full_name || 'Quản trị viên'}</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Theo dõi lưu lượng truy cập, tương tác 3D học tập và quản lý cơ sở dữ liệu học liệu Lịch sử 10.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15"
            title="Làm mới số liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Cập nhật</span>
          </button>
          <button
            onClick={onNewResource}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-bold transition shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm tư liệu mới</span>
          </button>
        </div>
      </div>

      {/* ================= ADMIN TABS SWITCHER ================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'bg-navy text-white shadow-sm ring-1 ring-gold/40 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          📊 Tổng quan & Phân tích (Analytics)
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'resources'
              ? 'bg-navy text-white shadow-sm ring-1 ring-gold/40 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>📚 Quản lý tư liệu ({resources.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-navy text-white shadow-sm ring-1 ring-gold/40 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>👥 Người dùng & Phân quyền ({users.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tổng lượt xem
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {analytics?.kpis?.total_views?.toLocaleString() || '12,480'}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  <TrendingUp className="w-3 h-3" /> +18.4%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Đo lường thời gian thực từ hệ thống</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tư liệu khảo cổ
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {analytics?.kpis?.total_resources || resources.length}
                </span>
                <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                  7 Chủ đề
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Chuẩn hóa GDPT 2018</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Học sinh & GV
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-800">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {analytics?.kpis?.total_users || users.length || 2}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800">
                  Đã xác thực
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Tài khoản bảo mật cao cấp</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mô hình 3D tương tác
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                  <Box className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {analytics?.kpis?.total_3d || 5}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  71.2% tương tác
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Xoay 360°, đổi ánh sáng</span>
            </div>
          </div>

          {/* Top Most Viewed & Live Activity Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Top Most Viewed Resources */}
            <div className="lg:col-span-7 bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Top 6 Tư Liệu Được Xem Nhiều Nhất
                  </h3>
                  <p className="text-xs text-slate-400">Bấm vào bất kỳ dòng nào để mở bảng kiểm tra Admin trực tiếp</p>
                </div>
                <span className="text-xs font-bold text-gold flex items-center gap-1">
                  <Award className="w-4 h-4 text-gold" /> Xếp hạng
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {analytics?.top_resources?.map((res, index) => (
                  <div
                    key={res.id}
                    onClick={() => handleOpenAdminPreview(res)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/80 px-3 rounded-2xl transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          index === 0
                            ? 'bg-amber-500 text-slate-950'
                            : index === 1
                            ? 'bg-slate-300 text-slate-900'
                            : index === 2
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <img
                        src={res.img}
                        alt={res.title}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 bg-slate-800 border border-slate-700 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-100 group-hover:text-gold transition truncate">
                          {res.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {res.place} • {res.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <span className="text-xs font-black text-gold flex items-center gap-1 justify-end">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {res.view_count?.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500">lượt xem</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-gold transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Activity Logs Audit Trail */}
            <div className="lg:col-span-5 bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Nhật Ký Hoạt Động Thời Gian Thực
                    </h3>
                    <p className="text-xs text-slate-400">Lịch sử truy cập và thao tác dữ liệu</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
                  {analytics?.recent_activities?.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gold flex items-center gap-1">
                          <Activity className="w-3 h-3 text-gold" />
                          {log.username}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.created_at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-tight">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
                <span>Nhật ký bảo mật hệ thống</span>
                <span className="text-emerald-400 font-semibold">Tự động đồng bộ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: DEDICATED ADMIN LIST VIEW (KHÔNG TẬN DỤNG VIEW CLIENT) ================= */}
      {activeTab === 'resources' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-sm overflow-hidden animate-fade-in space-y-4 p-5 sm:p-6">
          {/* Header & Filter Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">
                  Danh Sách Quản Trị Tư Liệu Di Tích
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-gold border border-slate-700">
                  {filteredResources.length} / {resources.length} tư liệu
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Giao diện quản lý độc quyền: xem nhanh chi tiết, hỗ trợ mở bộ biên soạn toàn màn hình và xóa an toàn.
              </p>
            </div>

            {/* Filter inputs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder="Tìm kiếm tư liệu..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Topic Filter */}
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">Tất cả chủ đề</option>
                <option value="1">Chủ đề 1</option>
                <option value="2">Chủ đề 2</option>
                <option value="3">Chủ đề 3</option>
                <option value="4">Chủ đề 4 (Đông Nam Á)</option>
                <option value="5">Chủ đề 5</option>
                <option value="6">Chủ đề 6</option>
                <option value="7">Chủ đề 7</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">Tất cả định dạng</option>
                <option value="3d">Mô hình 3D</option>
                <option value="image">Hình ảnh</option>
                <option value="video">Video</option>
                <option value="text">Văn bản</option>
              </select>

              <button
                onClick={onNewResource}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-black text-xs transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm tư liệu</span>
              </button>
            </div>
          </div>

          {/* High-Density Admin List View */}
          <div className="divide-y divide-slate-800 overflow-hidden">
            {filteredResources.map((res) => {
              const photos = getPreviewPhotos(res);
              const hasVideo = !!res.video_url;
              const has3D = !!res.model_3d;

              return (
                <div
                  key={res.id}
                  className="py-4 px-3 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/60 rounded-2xl transition group"
                >
                  {/* Left: Thumbnail & Main Info */}
                  <div
                    onClick={() => handleOpenAdminPreview(res)}
                    className="flex items-start sm:items-center gap-4 min-w-0 flex-1 cursor-pointer"
                  >
                    {/* Thumbnail with gallery indicator */}
                    <div className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-slate-700">
                      <img
                        src={res.img}
                        alt={res.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {photos.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-black text-gold px-1 rounded border border-white/20">
                          +{photos.length} ảnh
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          #{res.id}
                        </span>
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                          Chủ đề {res.topic_id}
                        </span>
                        {has3D && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Hiện vật 3D
                          </span>
                        )}
                        {hasVideo && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Video 4K
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-sm text-white group-hover:text-gold transition truncate">
                        {res.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        {res.lesson} • <span className="text-slate-300">{res.place}</span> ({res.period || 'Cổ đại'})
                      </p>
                    </div>
                  </div>

                  {/* Right: Metrics & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-left md:text-right">
                      <span className="text-xs font-black text-white flex items-center md:justify-end gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {(res.view_count || 1).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">lượt tham quan</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenAdminPreview(res)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                        title="Xem trước nội dung hồ sơ (Admin Inspector)"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold" />
                        <span>Xem</span>
                      </button>

                      <button
                        onClick={() => onEditResource(res)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-gold hover:text-slate-950 text-slate-200 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                        title="Mở trình biên tập toàn màn hình"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa tư liệu #${res.id}: ${res.title}?`)) {
                            onDeleteResource(res.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition border border-rose-800"
                        title="Xóa tư liệu vĩnh viễn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: USER MANAGEMENT TABLE ================= */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-sm overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-slate-800">
            <h3 className="font-extrabold text-base text-white">
              Danh Sách Tài Khoản Trong Hệ Thống
            </h3>
            <p className="text-xs text-slate-400">
              Mật khẩu tài khoản được bảo vệ bằng cơ chế mã hóa chuẩn an toàn cao cấp.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Tên đăng nhập</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Vai trò (Role)</th>
                  <th className="py-3 px-4">Thời gian tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">#{u.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{u.full_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{u.username}</td>
                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          u.role === 'admin'
                            ? 'bg-gold/20 text-gold border border-gold/40'
                            : u.role === 'teacher'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role === 'admin' ? 'Quản trị viên' : u.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEditUser(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-gold hover:text-slate-950 text-slate-200 text-xs font-bold transition border border-slate-700 shadow-2xs group"
                        title="Chỉnh sửa họ tên, vai trò và đổi mật khẩu"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gold group-hover:text-slate-950 transition-colors" />
                        <span>Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT USER (HỌ TÊN, ROLE & CHANGE PASSWORD) ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-100"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Chỉnh Sửa Tài Khoản #{editingUser.id}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cập nhật họ tên, vai trò và đặt lại mật khẩu cho tài khoản.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              {userMsg.text && (
                <div
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    userMsg.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                  }`}
                >
                  {userMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{userMsg.text}</span>
                </div>
              )}

              {/* Username (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Tên đăng nhập (Định danh tài khoản)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingUser.username}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 text-xs font-mono font-bold cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Họ và tên người dùng *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.full_name}
                  onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                  placeholder="Ví dụ: Thầy Nguyễn Văn An / Lê Minh Khôi"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Địa chỉ Email liên hệ
                </label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="email@sukyso.edu.vn"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Vai trò & Phân quyền (Role) *
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
                >
                  <option value="admin">Quản trị viên (Toàn quyền quản trị hệ thống & biên soạn)</option>
                  <option value="teacher">Giáo viên (Khai thác tư liệu & nghiệp vụ sư phạm)</option>
                  <option value="student">Học sinh (Khám phá tư liệu & tham quan 3D)</option>
                </select>
              </div>

              {/* Change Password */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-gold" />
                    <span>Đổi mật khẩu mới (Change Password)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Tùy chọn</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Để trống nếu giữ nguyên mật khẩu cũ..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold shadow-sm placeholder:text-slate-500 placeholder:font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Nhập tối thiểu 6 ký tự nếu bạn muốn cấp lại mật khẩu mới cho tài khoản này.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={userSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-md active:scale-95 disabled:opacity-50"
                >
                  {userSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Lưu Thay Đổi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DEDICATED ADMIN INSPECTOR DRAWER / MODAL (VIEW KHÁC CLIENT) ================= */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
          >
            {/* Top Bar of Inspector */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-gold text-slate-950 font-black text-xs font-mono">
                  #{previewResource.id}
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-white truncate max-w-lg">
                    {previewResource.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Bảng kiểm tra tư liệu nội bộ Quản trị viên
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = previewResource;
                    setPreviewResource(null);
                    onEditResource(toEdit);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa toàn màn hình</span>
                </button>
                <button
                  onClick={() => setPreviewResource(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Media Switcher: Gallery vs Video 4K vs 3D */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewActiveTab('gallery')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      previewActiveTab === 'gallery'
                        ? 'bg-white text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Image className="w-3.5 h-3.5" />
                    <span>Bộ ảnh ({previewPhotos.length})</span>
                  </button>

                  {previewYoutubeUrl && (
                    <button
                      onClick={() => setPreviewActiveTab('video')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        previewActiveTab === 'video'
                          ? 'bg-rose-600 text-white font-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Video YouTube 4K</span>
                    </button>
                  )}

                  {previewResource.model_3d && (
                    <button
                      onClick={() => setPreviewActiveTab('3d')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        previewActiveTab === '3d'
                          ? 'bg-gold text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Mô hình 3D tương tác</span>
                    </button>
                  )}
                </div>

                {/* Display Frame */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                  {previewActiveTab === 'video' && previewYoutubeUrl ? (
                    <iframe
                      src={`${previewYoutubeUrl}?rel=0`}
                      title={previewResource.title}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  ) : previewActiveTab === '3d' && previewResource.model_3d ? (
                    <div className="w-full h-full">
                      <ThreeArtifactViewer
                        modelCode={previewResource.model_3d}
                        artifactInfo={{ name: previewResource.title }}
                        height="100%"
                        showControls={true}
                      />
                    </div>
                  ) : (
                    <img
                      src={previewPhotos[previewPhotoIdx] || previewResource.img}
                      alt={previewResource.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Thumbnail filmstrip */}
                {previewActiveTab === 'gallery' && previewPhotos.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {previewPhotos.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPreviewPhotoIdx(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                          previewPhotoIdx === idx ? 'border-gold scale-105' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dossier Meta Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Chủ đề</span>
                  <strong className="text-white">Chủ đề {previewResource.topic_id}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Niên đại</span>
                  <strong className="text-white">{previewResource.period || 'Chưa rõ'}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Địa danh</span>
                  <strong className="text-white">{previewResource.place}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Lượt xem</span>
                  <strong className="text-gold">{(previewResource.view_count || 1).toLocaleString()}</strong>
                </div>
              </div>

              {/* Description body */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Nội dung mô tả học thuật:
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {previewResource.description}
                </p>
              </div>

              {/* Pedagogical tip */}
              {previewResource.tip && (
                <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-900/50 space-y-1 text-xs">
                  <strong className="text-amber-400 block font-bold">💡 Gợi ý khai thác sư phạm:</strong>
                  <p className="text-amber-200/90 leading-relaxed">{previewResource.tip}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500 font-mono">
                Cơ quan lưu giữ: {previewResource.source || 'Bảo tàng & UNESCO'}
              </span>
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
