import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Hero from './components/Hero.jsx';
import TopicCard from './components/TopicCard.jsx';
import ResourceCard from './components/ResourceCard.jsx';
import ResourceDetailView from './components/ResourceDetailView.jsx';
import ResourceEditorModal from './components/ResourceEditorModal.jsx';
import LoginModal from './components/LoginModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Studio3DView from './components/Studio3DView.jsx';
import TeachersView from './components/TeachersView.jsx';
import StudentsView from './components/StudentsView.jsx';
import AboutView from './components/AboutView.jsx';
import { createResourceSlug } from './utils/slugify.js';
import { Filter, Layers, Box, Search, RotateCcw, ArrowRight, BookOpen, Sparkles, AlertCircle, LayoutDashboard } from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [topics, setTopics] = useState([]);
  const [resources, setResources] = useState([]);
  const [artifacts3d, setArtifacts3d] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sukyso_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('sukyso_token') || '');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Filters read from Search Params for /kho-tu-lieu
  const searchQuery = searchParams.get('q') || '';
  const selectedTopicId = searchParams.get('topic') || 'all';
  const selectedType = searchParams.get('type') || 'all';

  const [inputSearch, setInputSearch] = useState(searchQuery);

  // Sync inputSearch with searchParams
  useEffect(() => {
    setInputSearch(searchQuery);
  }, [searchQuery]);

  // Modals
  const [editorResource, setEditorResource] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

  // Is this the full-width detail page or full-screen dashboard?
  const isDetailPage = location.pathname.startsWith('/tu-lieu/');
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Handle Login Success
  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('sukyso_user', JSON.stringify(user));
    localStorage.setItem('sukyso_token', token);
    if (user.role === 'admin') {
      navigate('/dashboard');
    }
  };

  // Handle Profile Update Success
  const handleProfileUpdated = (updatedUser, newToken) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('sukyso_user', JSON.stringify(updatedUser));
    if (newToken) {
      setAuthToken(newToken);
      localStorage.setItem('sukyso_token', newToken);
    }
    setDashboardRefreshTrigger((prev) => prev + 1);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    localStorage.removeItem('sukyso_user');
    localStorage.removeItem('sukyso_token');
    navigate('/');
  };

  // Initial Fetch Data from Backend
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const ts = Date.now();
      const [topicsRes, resRes, artRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/topics?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/resources?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/3d-artifacts?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/stats?_t=${ts}`).then((r) => (r.ok ? r.json() : null)),
      ]);

      setTopics(topicsRes);
      setResources(resRes);
      setArtifacts3d(artRes);
      setStats(statsRes);
    } catch (err) {
      console.error('Lỗi nạp dữ liệu từ backend:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Resources whenever searchParams change
  const fetchFilteredResources = async () => {
    try {
      const params = new URLSearchParams();
      params.append('_t', Date.now());
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (selectedTopicId !== 'all') params.append('topic_id', selectedTopicId);
      if (selectedType !== 'all') params.append('type', selectedType);

      const res = await fetch(`${API_BASE}/resources?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error('Lỗi lọc dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchFilteredResources();
  }, [searchQuery, selectedTopicId, selectedType]);

  const updateFilters = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Clean empty or default values
    Object.keys(merged).forEach((k) => {
      if (!merged[k] || merged[k] === 'all') delete merged[k];
    });

    setSearchParams(merged);
  };

  const handleSearchSubmit = () => {
    navigate('/kho-tu-lieu');
    updateFilters({ q: inputSearch.trim() });
  };

  // Navigate to Detail page with clean SEO Slug
  const handleSelectResource = (resource) => {
    const slug = createResourceSlug(resource.id, resource.title);
    navigate(`/tu-lieu/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Analytics increment view count
    fetch(`${API_BASE}/resources/${resource.id}/view`, {
      method: 'POST',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      }
    }).then(r => r.json()).then(data => {
      if (data.resource) {
        setResources(prev => prev.map(item => item.id === resource.id ? { ...item, view_count: data.resource.view_count } : item));
      }
    }).catch(() => {});
  };

  // CRUD Operations (Protected with real Admin JWT)
  const handleSaveResource = async (formData, id) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      throw new Error('Chỉ Quản trị viên (Admin) mới có quyền lưu hoặc sửa đổi tư liệu.');
    }

    const url = id ? `${API_BASE}/resources/${id}` : `${API_BASE}/resources`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu tư liệu');
    }

    const savedData = await res.json();
    await Promise.all([fetchInitialData(), fetchFilteredResources()]);
    setDashboardRefreshTrigger((prev) => prev + 1);
    return savedData;
  };

  const handleDeleteResource = async (id) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      alert('Chỉ Quản trị viên (Admin) mới có quyền xóa tư liệu.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/resources/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        await Promise.all([fetchInitialData(), fetchFilteredResources()]);
        setDashboardRefreshTrigger((prev) => prev + 1);
        if (!location.pathname.startsWith('/dashboard')) {
          navigate('/kho-tu-lieu');
        }
      } else {
        const err = await res.json();
        alert('Lỗi xóa tư liệu: ' + (err.error || 'Thao tác không thành công'));
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ: ' + err.message);
    }
  };

  const handleOpenNewResource = () => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      return;
    }
    setEditorResource(null);
    setIsEditorOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-gold selection:text-slate-950 font-sans ${isDashboard ? 'bg-slate-950 text-slate-100' : 'bg-[#f6f8fc]'}`}>
      {/* Top Navbar: Hidden on Admin Dashboard */}
      {!isDashboard && (
        <Navbar
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      )}

      {/* Main Container Wrapper */}
      <div className={isDashboard ? 'min-h-screen bg-slate-950 flex-1 flex flex-col px-4 sm:px-8 lg:px-12 py-4' : 'container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex my-4 gap-6'}>
        {/* Left Sidebar: HIDDEN on detail view and on dashboard */}
        {!isDetailPage && !isDashboard && (
          <Sidebar
            stats={stats}
            currentUser={currentUser}
          />
        )}

        {/* Dynamic Main Workspace Content */}
        <main className={`flex-1 min-w-0 ${isDetailPage || isDashboard ? 'w-full' : ''} ${!isDashboard ? 'pb-12' : ''}`}>
          <Routes>
            {/* ================= ROUTE: HOME ================= */}
            <Route
              path="/"
              element={
                <div className="space-y-8 animate-fade-in">
                  {/* Hero Banner */}
                  <Hero
                    searchQuery={inputSearch}
                    setSearchQuery={setInputSearch}
                    onSearchSubmit={handleSearchSubmit}
                    onOpenStudio3D={() => navigate('/studio-3d')}
                  />

                  {/* 3D Interactive Highlight Teaser */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold/20 text-gold-dark border border-gold/40">
                            ✨ Tính Năng Nổi Bật
                          </span>
                          <span className="text-xs text-slate-400 font-bold">• Trải nghiệm tương tác 3D 360°</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Studio Di Sản 3D & Hải Trình Cổ Đại
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          Trải nghiệm xoay 360 độ các bảo vật quốc gia: Trống đồng Ngọc Lũ, Đại tháp Borobudur, Bia Võ Cạnh, Đài thờ Mỹ Sơn và khám phá con đường thương mại trên biển qua quả cầu 3D.
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                          to="/studio-3d"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-navy text-white hover:bg-navy-light transition shadow active:scale-95"
                        >
                          <Box className="w-4 h-4 text-gold" />
                          <span>Trải nghiệm Studio 3D</span>
                        </Link>
                        <Link
                          to="/kho-tu-lieu?topic=4"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Xem tư liệu Đông Nam Á</span>
                        </Link>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-navy-dark text-white p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-gold-light">
                          Thống kê kho học liệu
                        </span>
                        <h4 className="text-lg font-black mt-1">Dữ Liệu Đã Được Thẩm Định</h4>
                        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                            <span className="text-slate-400 block font-medium">Chủ đề học tập:</span>
                            <strong className="text-xl font-black text-gold">{stats?.topics || 7}</strong>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                            <span className="text-slate-400 block font-medium">Tư liệu khảo cổ:</span>
                            <strong className="text-xl font-black text-emerald-400">{stats?.resources || 32}</strong>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                            <span className="text-slate-400 block font-medium">Mô hình 3D:</span>
                            <strong className="text-xl font-black text-amber-300">{stats?.artifacts_3d || 5}</strong>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                            <span className="text-slate-400 block font-medium">Tổng lượt tương tác:</span>
                            <strong className="text-xl font-black text-cyan-300">
                              {stats?.total_views ? stats.total_views.toLocaleString() : '12,480'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-[11px] text-slate-300">
                        Bám sát Chương trình Giáo dục Phổ thông 2018 môn Lịch sử lớp 10.
                      </p>
                    </div>
                  </div>

                  {/* 7 Curriculum Topics Grid */}
                  <div>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          Các Chủ Đề Lịch Sử 10
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Chọn chủ đề để xem danh mục bài học và tư liệu tương ứng
                        </p>
                      </div>
                      <Link
                        to="/chu-de"
                        className="text-xs font-bold text-navy hover:text-gold-dark transition flex items-center gap-1"
                      >
                        <span>Xem tất cả ({topics.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {topics.map((t) => (
                        <TopicCard
                          key={t.id}
                          topic={t}
                          onSelect={(topic) => {
                            navigate(`/kho-tu-lieu?topic=${topic.id}`);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Featured Artifacts Spotlight */}
                  <div>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          Hiện Vật & Tư Liệu Tiêu Biểu
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bảo vật quốc gia, di sản khảo cổ học và nguồn tư liệu lịch sử nổi bật
                        </p>
                      </div>
                      <Link
                        to="/kho-tu-lieu"
                        className="text-xs font-bold text-navy hover:text-gold-dark transition flex items-center gap-1"
                      >
                        <span>Khám phá toàn bộ kho ({resources.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {resources.slice(0, 6).map((res) => (
                        <ResourceCard
                          key={res.id}
                          resource={res}
                          onSelect={handleSelectResource}
                          onOpen3D={(code) => navigate(`/studio-3d/co-vat/${code}`)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              }
            />

            {/* ================= ROUTE: TOPICS ================= */}
            <Route
              path="/chu-de"
              element={
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      7 Chủ Đề Học Tập Môn Lịch Sử 10
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Được xây dựng theo mạch nội dung chuẩn của Chương trình GDPT 2018
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {topics.map((t) => (
                      <TopicCard
                        key={t.id}
                        topic={t}
                        onSelect={(topic) => {
                          navigate(`/kho-tu-lieu?topic=${topic.id}`);
                        }}
                      />
                    ))}
                  </div>
                </div>
              }
            />

            {/* ================= ROUTE: LIBRARY WITH URL SLUG PARAMS ================= */}
            <Route
              path="/kho-tu-lieu"
              element={
                <div className="space-y-6 animate-fade-in">
                  {/* Filter & Search Bar */}
                  <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Search Input */}
                      <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inputSearch}
                          onChange={(e) => setInputSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && updateFilters({ q: inputSearch.trim() })}
                          placeholder="Tìm kiếm tư liệu, bảo vật, địa danh, di tích..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy"
                        />
                      </div>

                      {/* Topic Filter */}
                      <select
                        value={selectedTopicId}
                        onChange={(e) => updateFilters({ topic: e.target.value })}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy"
                      >
                        <option value="all">Tất cả các chủ đề (7)</option>
                        {topics.map((t) => (
                          <option key={t.id} value={t.id}>
                            Chủ đề {t.id}: {t.title}
                          </option>
                        ))}
                      </select>

                      {/* Format Filter */}
                      <select
                        value={selectedType}
                        onChange={(e) => updateFilters({ type: e.target.value })}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy"
                      >
                        <option value="all">Tất cả định dạng</option>
                        <option value="3d">Mô hình 3D tương tác</option>
                        <option value="image">Hình ảnh khảo cổ</option>
                        <option value="video">Video bài học</option>
                        <option value="text">Văn bản / Bia ký</option>
                      </select>

                      {/* Reset Button */}
                      {(searchQuery || selectedTopicId !== 'all' || selectedType !== 'all') && (
                        <button
                          onClick={() => {
                            setInputSearch('');
                            setSearchParams({});
                          }}
                          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          title="Đặt lại bộ lọc"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Results Count & Quick Format Pills */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>
                        Hiển thị <strong>{resources.length}</strong> tư liệu học tập
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateFilters({ type: selectedType === '3d' ? 'all' : '3d' })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            selectedType === '3d'
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Box className="w-3.5 h-3.5" /> 3D Models
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Resource Cards Grid */}
                  {resources.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                      <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h4 className="font-bold text-sm text-slate-700">Không tìm thấy tư liệu phù hợp</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Hãy thử từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {resources.map((res) => (
                        <ResourceCard
                          key={res.id}
                          resource={res}
                          onSelect={handleSelectResource}
                          onOpen3D={(code) => navigate(`/studio-3d/co-vat/${code}`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              }
            />

            {/* ================= ROUTE: FULL DETAIL VIEW WITH SLUG (NO SIDEBAR) ================= */}
            <Route
              path="/tu-lieu/:slug"
              element={
                <ResourceDetailView
                  allResources={resources}
                  currentUser={currentUser}
                  onEdit={(res) => {
                    setEditorResource(res);
                    setIsEditorOpen(true);
                  }}
                  onDelete={handleDeleteResource}
                />
              }
            />

            {/* ================= ROUTE: STUDIO 3D WITH REAL SLUGS ================= */}
            <Route
              path="/studio-3d"
              element={<Navigate to="/studio-3d/co-vat/dong_son_drum" replace />}
            />
            <Route
              path="/studio-3d/:mode"
              element={
                <Studio3DView
                  artifacts3d={artifacts3d}
                  currentUser={currentUser}
                  authToken={authToken}
                  onArtifacts3DChange={fetchInitialData}
                />
              }
            />
            <Route
              path="/studio-3d/:mode/:artifactCode"
              element={
                <Studio3DView
                  artifacts3d={artifacts3d}
                  currentUser={currentUser}
                  authToken={authToken}
                  onArtifacts3DChange={fetchInitialData}
                />
              }
            />

            {/* ================= ROUTE: TEACHERS WITH REAL SLUGS ================= */}
            <Route
              path="/giao-vien"
              element={<Navigate to="/giao-vien/cam-nang" replace />}
            />
            <Route
              path="/giao-vien/:tab"
              element={<TeachersView />}
            />

            {/* ================= ROUTE: STUDENTS WITH REAL SLUGS ================= */}
            <Route
              path="/hoc-sinh"
              element={<Navigate to="/hoc-sinh/nhiem-vu" replace />}
            />
            <Route
              path="/hoc-sinh/:tab"
              element={<StudentsView />}
            />

            {/* ================= ROUTE: ABOUT ================= */}
            <Route path="/gioi-thieu" element={<AboutView />} />

            {/* ================= ROUTE: ADMIN DASHBOARD ================= */}
            <Route
              path="/dashboard"
              element={
                currentUser?.role === 'admin' ? (
                  <AdminDashboard
                    currentUser={currentUser}
                    authToken={authToken}
                    onNewResource={handleOpenNewResource}
                    onEditResource={(res) => {
                      setEditorResource(res);
                      setIsEditorOpen(true);
                    }}
                    onDeleteResource={handleDeleteResource}
                    refreshTrigger={dashboardRefreshTrigger}
                    onLogout={handleLogout}
                    artifacts3d={artifacts3d}
                    onArtifacts3DChange={fetchInitialData}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Resource Editor Modal (Create / Edit) */}
      {isEditorOpen && (
        <ResourceEditorModal
          resource={editorResource}
          topics={topics}
          onClose={() => {
            setIsEditorOpen(false);
            setEditorResource(null);
          }}
          onSave={handleSaveResource}
        />
      )}

      {/* Real Auth Login / Register Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        authToken={authToken}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
